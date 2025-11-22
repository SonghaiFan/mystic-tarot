import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  RefreshCw,
  Check,
  Download,
  Volume2,
} from "lucide-react";
import { GameState, TarotCard, SpreadType, PickedCard } from "./types";
import {
  MAJOR_ARCANA,
  FULL_DECK,
  STATIC_SCRIPTS,
  getCardImageUrl,
  getCardImageFallbackUrl,
} from "./constants";
import { generateTarotReading, generateSpeech } from "./services/gemini";
import AudioVisualizer from "./components/AudioVisualizer";
import CosmicParticles from "./components/CosmicParticles";

// --- Configuration ---
const SILKY_EASE = [0.22, 1, 0.36, 1];
const BACKGROUND_VOLUME = 0.06;

// --- Ambient Sound Engine ---
class SoundEngine {
  private ctx: AudioContext;
  private audioElement: HTMLAudioElement | null = null;
  private source: MediaElementAudioSourceNode | null = null;
  private gain: GainNode | null = null;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
  }

  async startDrone() {
    if (this.audioElement) return; // Already playing

    try {
      // Create audio element for background music
      this.audioElement = new Audio("/audio/background.mp3");
      this.audioElement.loop = true;

      // Create Web Audio nodes
      this.source = this.ctx.createMediaElementSource(this.audioElement);
      this.gain = this.ctx.createGain();

      this.gain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.source.connect(this.gain);
      this.gain.connect(this.ctx.destination);

      // Start playing
      await this.audioElement.play();

      // Fade in over 5 seconds
      this.gain.gain.linearRampToValueAtTime(
        BACKGROUND_VOLUME,
        this.ctx.currentTime + 5
      );

      console.log("Background music started");
    } catch (error) {
      console.error("Background music playback failed:", error);
    }
  }

  stop() {
    if (!this.gain || !this.audioElement) return;

    const t = this.ctx.currentTime;
    // Fade out over 2 seconds
    this.gain.gain.linearRampToValueAtTime(0.001, t + 2);

    setTimeout(() => {
      this.audioElement?.pause();
      this.audioElement = null;
      this.source = null;
      this.gain = null;
    }, 2000);
  }
}

const App: React.FC = () => {
  // --- State ---
  const [gameState, setGameState] = useState<GameState>(GameState.INTRO);

  // Input State
  const [question, setQuestion] = useState("");
  const [spread, setSpread] = useState<SpreadType>("SINGLE");
  const [includeMinor, setIncludeMinor] = useState(false); // Toggle for Minor Arcana in 3-card spread

  // Game Data
  const [pickedCards, setPickedCards] = useState<PickedCard[]>([]);
  const [readingText, setReadingText] = useState<string>("");
  const [readingAudioBuffer, setReadingAudioBuffer] =
    useState<AudioBuffer | null>(null);

  // System State
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // --- Refs ---
  const audioContextRef = useRef<AudioContext | null>(null);
  const soundEngineRef = useRef<SoundEngine | null>(null);
  const audioCacheRef = useRef<Map<string, AudioBuffer>>(new Map());
  const voiceSourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // --- Computed Deck ---
  const activeDeck = useMemo(() => {
    if (spread === "SINGLE") {
      return MAJOR_ARCANA; // Single card is always Major Arcana
    } else {
      // Three card can be Major Only or Full Deck based on user choice
      return includeMinor ? FULL_DECK : MAJOR_ARCANA;
    }
  }, [spread, includeMinor]);

  // --- Audio Initialization ---
  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;
      soundEngineRef.current = new SoundEngine(ctx);
      console.log("AudioContext created");
    }
    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume().then(() => {
        console.log("AudioContext resumed");
      });
    }
  }, []);

  // --- Playback Logic ---

  const playBuffer = useCallback((buffer: AudioBuffer) => {
    if (!audioContextRef.current) return;

    // Stop previous voice if any
    if (voiceSourceRef.current) {
      try {
        voiceSourceRef.current.stop();
      } catch (e) {}
    }

    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;

    // Voice Gain (louder than drone)
    const gainNode = audioContextRef.current.createGain();
    gainNode.gain.value = 1.0;

    source.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    voiceSourceRef.current = source;
    setIsAudioPlaying(true);
    source.start();
    source.onended = () => setIsAudioPlaying(false);
  }, []);

  const playVoice = useCallback(
    async (
      text: string,
      cacheKey?: string,
      staticKey?: string
    ): Promise<void> => {
      if (!audioContextRef.current) return;

      // 1. Check Cache
      if (cacheKey && audioCacheRef.current.has(cacheKey)) {
        playBuffer(audioCacheRef.current.get(cacheKey)!);
        return;
      }

      // 2. Generate with Gemini (will try local first if staticKey provided)
      try {
        const buffer = await generateSpeech(
          text,
          audioContextRef.current,
          staticKey
        );
        if (buffer) {
          if (cacheKey) audioCacheRef.current.set(cacheKey, buffer);
          playBuffer(buffer);
        } else {
          // Silence on error/timeout (No Fallback)
          console.warn("TTS unavailable. Staying silent.");
        }
      } catch (err) {
        console.error("Voice generation exception", err);
      }
    },
    [playBuffer]
  );

  // Prefetch static scripts silently (tries local first, then Gemini)
  const prefetchStaticAudio = useCallback(async () => {
    if (!audioContextRef.current) return;
    const scripts = [
      { k: "ASK", t: STATIC_SCRIPTS.ASK },
      { k: "SHUFFLE", t: STATIC_SCRIPTS.SHUFFLE },
      { k: "PICK", t: STATIC_SCRIPTS.PICK },
      { k: "REVEAL", t: STATIC_SCRIPTS.REVEAL },
    ];
    for (const s of scripts) {
      if (!audioCacheRef.current.has(s.k)) {
        generateSpeech(s.t, audioContextRef.current, s.k.toLowerCase())
          .then((buf) => {
            if (buf) audioCacheRef.current.set(s.k, buf);
          })
          .catch(() => {
            /* Ignore prefetch errors */
          });
      }
    }
  }, []);

  // --- Flow Handlers ---

  const enterInputPhase = async () => {
    initAudio();

    // Wait a bit for AudioContext to be ready
    await new Promise((resolve) => setTimeout(resolve, 100));

    soundEngineRef.current?.startDrone();
    setGameState(GameState.INPUT);
    prefetchStaticAudio();

    // Play WELCOME first, then ASK after a delay
    await playVoice(STATIC_SCRIPTS.WELCOME, "WELCOME", "welcome");
    setTimeout(() => playVoice(STATIC_SCRIPTS.ASK, "ASK", "ask"), 1500);
  };

  const startRitual = async () => {
    setGameState(GameState.SHUFFLING);
    setPickedCards([]);
    await playVoice(STATIC_SCRIPTS.SHUFFLE, "SHUFFLE", "shuffle");

    // Auto advance after shuffle (5s)
    setTimeout(() => {
      setGameState(GameState.PICKING);
      playVoice(STATIC_SCRIPTS.PICK, "PICK", "pick");
    }, 5000);
  };

  const handleCardSelect = async (card: TarotCard) => {
    if (isThinking || gameState !== GameState.PICKING) return;

    // Prevent picking duplicate cards
    if (pickedCards.some((c) => c.id === card.id)) return;

    // Determine Upright vs Reversed (50% chance of reversal now)
    const isReversed = Math.random() > 0.5;

    const newPicked: PickedCard[] = [...pickedCards, { ...card, isReversed }];
    setPickedCards(newPicked);

    const requiredCards = spread === "SINGLE" ? 1 : 3;

    // If we have all cards, proceed to reveal
    if (newPicked.length === requiredCards) {
      // Short delay to let the pick animation play
      setTimeout(() => startRevealProcess(newPicked), 1000);
    }
  };

  const startRevealProcess = async (finalCards: PickedCard[]) => {
    setGameState(GameState.REVEAL);
    playVoice(STATIC_SCRIPTS.REVEAL, "REVEAL", "reveal");

    // Start Thinking Process
    setIsThinking(true);

    // 1. Get Text Reading
    const text = await generateTarotReading(finalCards, spread, question);
    setReadingText(text);

    // 2. Get Audio for Reading (Wait for this before showing text)
    let audioBuffer = null;
    if (audioContextRef.current) {
      // Try Gemini TTS
      audioBuffer = await generateSpeech(text, audioContextRef.current);
    }

    // Save audio buffer for replay
    setReadingAudioBuffer(audioBuffer);

    // Transition to Reading state immediately (regardless of whether audio succeeded)
    setIsThinking(false);
    setGameState(GameState.READING);

    if (audioBuffer) {
      playBuffer(audioBuffer);
    }
    // If audioBuffer is null, we just show the text silently
  };

  const resetRitual = () => {
    if (voiceSourceRef.current) {
      try {
        voiceSourceRef.current.stop();
      } catch (e) {}
    }
    setGameState(GameState.INPUT);
    setPickedCards([]);
    setReadingText("");
    setReadingAudioBuffer(null);
    setQuestion("");
    // Keep drone playing
    playVoice(STATIC_SCRIPTS.ASK, "ASK", "ask");
  };

  // Replay reading audio
  const replayAudio = () => {
    if (readingAudioBuffer && !isAudioPlaying) {
      playBuffer(readingAudioBuffer);
    }
  };

  // Download reading as image
  const downloadReading = async () => {
    try {
      const { toPng } = await import("html-to-image");

      // 创建一个精美的卡牌解读图片
      const container = document.createElement("div");
      container.style.cssText = `
        position: absolute;
        left: 0;
        top: 0;
        background: #0f0f0f;
        color: #e5e5e5;
        padding: 60px 50px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        width: 1000px;
        box-sizing: border-box;
        z-index: -1;
        opacity: 1;
        pointer-events: none;
      `;

      // 顶部标题
      const headerDiv = document.createElement("div");
      headerDiv.style.cssText = `
        text-align: center;
        margin-bottom: 40px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        padding-bottom: 30px;
      `;

      const titleDiv = document.createElement("div");
      titleDiv.style.cssText = `
        font-size: 28px;
        letter-spacing: 8px;
        color: #fff;
        margin-bottom: 12px;
        font-weight: 300;
      `;
      titleDiv.textContent = "塔罗解读";

      const subtitleDiv = document.createElement("div");
      subtitleDiv.style.cssText = `
        font-size: 10px;
        letter-spacing: 4px;
        color: #666;
        text-transform: uppercase;
      `;
      subtitleDiv.textContent = "TAROT READING";

      headerDiv.appendChild(titleDiv);
      headerDiv.appendChild(subtitleDiv);
      container.appendChild(headerDiv);

      // 问题部分
      if (question) {
        const questionSection = document.createElement("div");
        questionSection.style.cssText = `
          margin-bottom: 40px;
          text-align: center;
        `;

        const questionLabel = document.createElement("div");
        questionLabel.style.cssText = `
          font-size: 10px;
          letter-spacing: 3px;
          color: #666;
          margin-bottom: 12px;
          text-transform: uppercase;
        `;
        questionLabel.textContent = "Your Question";

        const questionText = document.createElement("div");
        questionText.style.cssText = `
          font-size: 16px;
          color: #b8b8b8;
          line-height: 1.8;
          max-width: 700px;
          margin: 0 auto;
        `;
        questionText.textContent = `"${question}"`;

        questionSection.appendChild(questionLabel);
        questionSection.appendChild(questionText);
        container.appendChild(questionSection);
      }

      // 卡牌区域
      const cardsSection = document.createElement("div");
      cardsSection.style.cssText = `
        margin-bottom: 50px;
      `;

      const cardsLabel = document.createElement("div");
      cardsLabel.style.cssText = `
        font-size: 10px;
        letter-spacing: 3px;
        color: #666;
        margin-bottom: 20px;
        text-align: center;
        text-transform: uppercase;
      `;
      cardsLabel.textContent =
        spread === "SINGLE" ? "One Card Oracle" : "Past · Present · Future";
      cardsSection.appendChild(cardsLabel);

      const cardsContainer = document.createElement("div");
      cardsContainer.style.cssText = `
        display: flex;
        justify-content: center;
        gap: 30px;
        align-items: flex-start;
      `;

      pickedCards.forEach((card, index) => {
        const cardDiv = document.createElement("div");
        cardDiv.style.cssText = `
          width: ${spread === "SINGLE" ? "280px" : "200px"};
          text-align: center;
        `;

        // 卡牌图片
        const img = document.createElement("img");
        img.src = getCardImageUrl(card.image);
        img.crossOrigin = "anonymous";
        img.onerror = () => {
          img.src = getCardImageFallbackUrl(card.image);
        };
        img.style.cssText = `
          width: 100%;
          height: auto;
          border: 1px solid rgba(255,255,255,0.15);
          filter: grayscale(100%) contrast(1.2) brightness(0.9);
          margin-bottom: 16px;
        `;

        // 卡牌名称
        const nameDiv = document.createElement("div");
        nameDiv.style.cssText = `
          font-size: 14px;
          color: #e5e5e5;
          letter-spacing: 1px;
          margin-bottom: 6px;
        `;
        nameDiv.textContent = card.nameCn;

        // 英文名和逆位标识
        const enNameDiv = document.createElement("div");
        enNameDiv.style.cssText = `
          font-size: 10px;
          color: #888;
          letter-spacing: 1px;
          margin-bottom: 12px;
        `;
        enNameDiv.textContent = card.isReversed
          ? `${card.nameEn} (Reversed)`
          : card.nameEn;

        // 关键词
        const keywordsDiv = document.createElement("div");
        keywordsDiv.style.cssText = `
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          justify-content: center;
        `;

        card.keywords.slice(0, 4).forEach((keyword) => {
          const keywordSpan = document.createElement("span");
          keywordSpan.style.cssText = `
            font-size: 9px;
            color: #999;
            padding: 4px 8px;
            border: 1px solid rgba(255,255,255,0.08);
            background: rgba(255,255,255,0.03);
            letter-spacing: 1px;
          `;
          keywordSpan.textContent = keyword;
          keywordsDiv.appendChild(keywordSpan);
        });

        cardDiv.appendChild(img);
        cardDiv.appendChild(nameDiv);
        cardDiv.appendChild(enNameDiv);
        cardDiv.appendChild(keywordsDiv);
        cardsContainer.appendChild(cardDiv);
      });

      cardsSection.appendChild(cardsContainer);
      container.appendChild(cardsSection);

      // 解读内容部分
      const readingSection = document.createElement("div");
      readingSection.style.cssText = `
        margin-top: 50px;
        padding-top: 40px;
        border-top: 1px solid rgba(255,255,255,0.1);
      `;

      const readingLabel = document.createElement("div");
      readingLabel.style.cssText = `
        font-size: 10px;
        letter-spacing: 3px;
        color: #666;
        margin-bottom: 20px;
        text-align: center;
        text-transform: uppercase;
      `;
      readingLabel.textContent = "Interpretation";

      const textDiv = document.createElement("div");
      textDiv.style.cssText = `
        font-size: 16px;
        line-height: 2.2;
        color: #d0d0d0;
        text-align: justify;
        max-width: 850px;
        margin: 0 auto;
        font-weight: 300;
        text-indent: 2em;
      `;
      textDiv.textContent = readingText;

      readingSection.appendChild(readingLabel);
      readingSection.appendChild(textDiv);
      container.appendChild(readingSection);

      // 底部时间戳
      const footerDiv = document.createElement("div");
      footerDiv.style.cssText = `
        margin-top: 50px;
        text-align: center;
        font-size: 9px;
        color: #444;
        letter-spacing: 2px;
      `;
      const now = new Date();
      footerDiv.textContent = now.toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
      container.appendChild(footerDiv);

      document.body.appendChild(container);

      // 等待图片加载
      const images = container.querySelectorAll("img");
      await Promise.all(
        Array.from(images).map(
          (img) =>
            new Promise((resolve) => {
              if (img.complete) resolve(null);
              else {
                img.onload = () => resolve(null);
                img.onerror = () => resolve(null);
              }
            })
        )
      );

      // 等待一小段时间确保渲染完成
      await new Promise((resolve) => setTimeout(resolve, 300));

      // 生成图片
      const dataUrl = await toPng(container, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: "#0a0a0a",
        cacheBust: true,
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
        },
      });

      // 清理
      document.body.removeChild(container);

      // 下载
      const link = document.createElement("a");
      link.download = `tarot-reading-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("下载失败:", error);
    }
  };

  // --- Render Helpers ---

  const getSpreadName = (s: SpreadType) =>
    s === "SINGLE" ? "One Card Oracle" : "Trinity of Time";
  const getSpreadDesc = (s: SpreadType) =>
    s === "SINGLE"
      ? "Daily guidance & Simple answers"
      : "Past, Present, and Future";

  // Dynamic Background Opacity: High in Intro, Low otherwise
  const bgOpacity = gameState === GameState.INTRO ? 0.9 : 0.3;

  return (
    <div className="fixed inset-0 bg-black text-neutral-200 font-serif select-none cursor-default overflow-hidden">
      {/* Cosmic Particle Background (Persistent) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: bgOpacity }}
        transition={{ duration: 2 }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <CosmicParticles />
      </motion.div>

      {/* Header */}
      <header className="absolute top-0 w-full p-6 md:p-8 flex justify-between items-end z-40 pointer-events-none">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-white/80">
            <Sparkles size={14} />
            <h1 className="text-xs font-cinzel tracking-[0.4em] font-bold">
              MYSTIC
            </h1>
          </div>
          <div className="w-full h-[1px] bg-white/10" />
        </div>
        <AudioVisualizer isPlaying={isAudioPlaying} />
      </header>

      {/* Main Content Area - No Scroll */}
      <main className="absolute inset-0 z-10 overflow-hidden perspective-1000">
        {/* Inner Container - Full Height Centered */}
        <div className="h-full w-full flex flex-col items-center justify-center py-24 px-4">
          <AnimatePresence mode="wait">
            {/* --- STATE: INTRO --- */}
            {gameState === GameState.INTRO && (
              <motion.div
                key="intro"
                className="flex flex-col items-center text-center space-y-12 z-20"
                exit={{
                  opacity: 0,
                  filter: "blur(20px)",
                  transition: { duration: 1 },
                }}
              >
                <div className="relative">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, ease: SILKY_EASE }}
                    className="text-7xl md:text-9xl font-thin tracking-tighter text-white mix-blend-difference opacity-90"
                  >
                    命运
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1.5 }}
                    className="absolute -bottom-6 left-0 w-full text-center text-[10px] md:text-xs tracking-[1.2em] text-neutral-500 font-cinzel"
                  >
                    TAROT
                  </motion.p>
                </div>

                <div className="flex flex-col items-center gap-6">
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    onClick={enterInputPhase}
                    className="group relative px-10 py-4 border border-white/10 hover:border-white/40 transition-all duration-700 bg-black/50 backdrop-blur-md"
                  >
                    <span className="relative z-10 flex items-center gap-4 text-xs tracking-[0.3em] text-neutral-400 group-hover:text-white transition-colors">
                      ENTER THE VOID <ArrowRight size={12} />
                    </span>
                    <div className="absolute inset-0 bg-white/5 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left ease-out" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* --- STATE: INPUT (Question & Spread) --- */}
            {gameState === GameState.INPUT && (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, transition: { duration: 0.8 } }}
                transition={{ duration: 1, ease: SILKY_EASE }}
                className="w-full max-w-lg flex flex-col gap-12 items-center mt-10"
              >
                {/* Question Input */}
                <div className="w-full space-y-4">
                  <label className="text-[10px] tracking-[0.3em] text-neutral-500 uppercase block text-center">
                    What is your query?
                  </label>
                  <input
                    type="text"
                    name="tarot-query"
                    autoComplete="off"
                    data-lpignore="true"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask the universe..."
                    className="w-full bg-transparent border-b border-white/20 py-4 text-center text-xl md:text-2xl text-white placeholder:text-white/10 focus:outline-none focus:border-white/60 transition-colors font-serif"
                  />
                </div>

                {/* Spread Selection */}
                <div className="w-full space-y-6">
                  <label className="text-[10px] tracking-[0.3em] text-neutral-500 uppercase block text-center">
                    Choose your Path
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {(["SINGLE", "THREE"] as SpreadType[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => setSpread(s)}
                        className={`relative p-6 border transition-all duration-500 flex flex-col items-center gap-4 group ${
                          spread === s
                            ? "border-white/60 bg-white/5"
                            : "border-white/10 hover:border-white/30"
                        }`}
                      >
                        <div className="flex gap-1 items-center h-8">
                          {s === "SINGLE" ? (
                            <div
                              className={`w-5 h-8 border rounded-[1px] ${
                                spread === s
                                  ? "bg-white/80 border-transparent"
                                  : "border-white/30"
                              }`}
                            />
                          ) : (
                            <>
                              <div
                                className={`w-5 h-8 border rounded-[1px] translate-y-1 ${
                                  spread === s
                                    ? "bg-white/40 border-transparent"
                                    : "border-white/30"
                                }`}
                              />
                              <div
                                className={`w-5 h-8 border rounded-[1px] -translate-y-1 z-10 ${
                                  spread === s
                                    ? "bg-white/90 border-transparent"
                                    : "border-white/50"
                                }`}
                              />
                              <div
                                className={`w-5 h-8 border rounded-[1px] translate-y-1 ${
                                  spread === s
                                    ? "bg-white/40 border-transparent"
                                    : "border-white/30"
                                }`}
                              />
                            </>
                          )}
                        </div>
                        <div className="text-center space-y-1">
                          <span
                            className={`block text-xs tracking-widest ${
                              spread === s ? "text-white" : "text-neutral-500"
                            }`}
                          >
                            {getSpreadName(s)}
                          </span>
                          <span className="block text-[9px] text-neutral-600">
                            {getSpreadDesc(s)}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Minor Arcana Toggle (Only for Three Card Spread) */}
                  <AnimatePresence>
                    {spread === "THREE" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <button
                          onClick={() => setIncludeMinor(!includeMinor)}
                          className="w-full flex items-center justify-center gap-3 py-2 cursor-pointer group"
                        >
                          <div
                            className={`w-4 h-4 border flex items-center justify-center transition-colors ${
                              includeMinor
                                ? "border-white bg-white/20"
                                : "border-neutral-600"
                            }`}
                          >
                            {includeMinor && (
                              <Check size={10} className="text-white" />
                            )}
                          </div>
                          <span
                            className={`text-[10px] tracking-widest transition-colors ${
                              includeMinor
                                ? "text-neutral-300"
                                : "text-neutral-600 group-hover:text-neutral-400"
                            }`}
                          >
                            INCLUDE MINOR ARCANA (包含小阿尔克那)
                          </span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <motion.button
                  onClick={startRitual}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-8 px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/20 text-xs tracking-[0.3em] text-white transition-all"
                >
                  BEGIN RITUAL
                </motion.button>
              </motion.div>
            )}

            {/* --- STATE: SHUFFLING --- */}
            {gameState === GameState.SHUFFLING && (
              <motion.div
                key="shuffling"
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                exit={{ opacity: 0, transition: { duration: 0.5 } }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute w-48 h-80 md:w-64 md:h-96 bg-[#0a0a0a] border border-white/20 rounded-sm shadow-2xl origin-bottom overflow-hidden"
                    initial={{ y: 0, rotate: 0, scale: 1 }}
                    animate={{
                      y: [0, -40, 0],
                      rotate: [0, i === 1 ? 5 : i === 2 ? -5 : 0, 0],
                      x: [0, i === 1 ? 40 : i === 2 ? -40 : 0, 0],
                      zIndex: [i, 10, i],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut",
                    }}
                  >
                    {/* Card Back Texture */}
                    <div className="w-full h-full opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800 to-black">
                      <div
                        className="w-full h-full opacity-20"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle, #fff 1px, transparent 1px)",
                          backgroundSize: "10px 10px",
                        }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center border-8 border-double border-white/10 m-2" />
                    </div>
                  </motion.div>
                ))}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  className="absolute bottom-24 text-xs tracking-[0.5em] text-neutral-500 animate-pulse"
                >
                  CONCENTRATING...
                </motion.p>
              </motion.div>
            )}

            {/* --- STATE: PICKING (Floating Galaxy) --- */}
            {gameState === GameState.PICKING && (
              <motion.div
                key="picking"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative w-full h-full flex items-center justify-center overflow-hidden"
              >
                {/* Status Text & Count */}
                <div className="fixed top-24 left-0 w-full text-center z-50 pointer-events-none">
                  <p className="text-[10px] tracking-[0.4em] text-neutral-500 uppercase">
                    Select {spread === "SINGLE" ? 1 : 3} Cards
                  </p>
                  <div className="flex justify-center gap-2 mt-2">
                    {Array.from({ length: spread === "SINGLE" ? 1 : 3 }).map(
                      (_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 border border-white/30 rotate-45 transition-all duration-500 ${
                            i < pickedCards.length
                              ? "bg-white scale-110"
                              : "bg-transparent scale-90"
                          }`}
                        />
                      )
                    )}
                  </div>
                </div>

                {/* The Galaxy Container - Rotates Slowly (Aligned with particles) */}
                <motion.div
                  className="absolute w-0 h-0 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 180,
                    ease: "linear",
                    repeat: Infinity,
                  }} // Slower rotation (180s) to be majestic
                >
                  {activeDeck.map((card, i) => {
                    const isPicked = pickedCards.some((c) => c.id === card.id);

                    // Spiral Calculation (Golden Angle)
                    const goldenAngle = 137.508; // degrees
                    const angle = i * goldenAngle * (Math.PI / 180);

                    // Responsive Radius & Spacing
                    const isFullDeck = activeDeck.length > 22;

                    // Optimization for Mobile to prevent cards going off screen too much
                    const baseSpacing = isMobile ? 10 : 22;
                    const spacing = isFullDeck
                      ? baseSpacing * 0.6
                      : baseSpacing;

                    const startRadius = isMobile ? 40 : 100;
                    const radius = startRadius + i * spacing;

                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;

                    // Random Float Params (Deterministic based on ID)
                    const seed = card.id * 123.45;
                    const floatDuration = 4 + (seed % 4);
                    const floatY = 10 + (seed % 10);

                    return (
                      <motion.div
                        key={card.id}
                        layoutId={`card-${card.id}`}
                        style={{
                          position: "absolute",
                          left: x,
                          top: y,
                          marginLeft: isMobile ? -24 : -48, // Half width
                          marginTop: isMobile ? -36 : -72, // Half height
                        }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                          scale: isPicked ? 0 : 1,
                          opacity: isPicked ? 0 : 1,
                          rotate: [0, 5, -5, 0],
                          y: [0, -floatY, 0],
                        }}
                        transition={{
                          scale: { duration: 0.5 },
                          opacity: { duration: 0.5 },
                          rotate: {
                            duration: floatDuration * 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          },
                          y: {
                            duration: floatDuration,
                            repeat: Infinity,
                            ease: "easeInOut",
                          },
                        }}
                        onClick={() => !isPicked && handleCardSelect(card)}
                        className="cursor-pointer group"
                      >
                        {/* Card Back Design */}
                        <div
                          className={`
                                        relative bg-neutral-950 border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]
                                        flex items-center justify-center transition-all duration-300 overflow-hidden
                                        group-hover:border-white/40 group-hover:shadow-[0_0_25px_rgba(255,255,255,0.1)]
                                        ${isMobile ? "w-12 h-18" : "w-24 h-36"}
                                    `}
                        >
                          {/* Subtle Pattern */}
                          <div
                            className="absolute inset-0 opacity-20"
                            style={{
                              backgroundImage:
                                "radial-gradient(circle, #fff 1px, transparent 1px)",
                              backgroundSize: "6px 6px",
                            }}
                          ></div>
                          <div className="absolute inset-1 border-[0.5px] border-white/5" />
                          <div className="w-3 h-3 border border-white/10 rotate-45 group-hover:rotate-90 transition-transform duration-700" />
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>

                {/* Picked Card Landing Slots (Visual only) */}
                <div className="fixed bottom-12 flex gap-3 justify-center w-full pointer-events-none z-50">
                  {pickedCards.map((c, i) => (
                    <motion.div
                      key={`slot-${c.id}`}
                      layoutId={`card-${c.id}`} // Match layoutID for smooth fly-in
                      className={`bg-white/10 border border-white/40 ${
                        isMobile ? "w-12 h-18" : "w-16 h-24"
                      }`}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ease: SILKY_EASE, duration: 0.6 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* --- STATE: REVEAL & READING --- */}
            {(gameState === GameState.REVEAL ||
              gameState === GameState.READING) &&
              pickedCards.length > 0 && (
                <motion.div
                  key="reading-layout"
                  className="flex flex-col items-center w-full max-w-6xl gap-10"
                >
                  {/* Cards Display Grid */}
                  <div
                    className={`flex flex-wrap justify-center gap-4 md:gap-8 mt-10 ${
                      spread === "THREE" ? "items-start" : "items-center"
                    }`}
                  >
                    {pickedCards.map((card, index) => (
                      // OUTER MOTION: Handles Position via LayoutID
                      <motion.div
                        key={card.id}
                        layoutId={`card-${card.id}`}
                        className={`relative ${
                          spread === "SINGLE"
                            ? "w-64 h-96 md:w-80 md:h-[480px]"
                            : "w-28 h-44 md:w-56 md:h-80" // Optimized for mobile 3-card row
                        }`}
                      >
                        {/* INNER MOTION: Handles 3D FLIP and REVERSAL */}
                        <motion.div
                          initial={{
                            rotateY: 180,
                            rotateZ: card.isReversed ? 180 : 0,
                          }}
                          animate={{
                            rotateY: 0,
                            rotateZ: card.isReversed ? 180 : 0,
                          }}
                          transition={{
                            duration: 1.4,
                            delay: index * 0.3,
                            ease: "circOut",
                          }}
                          style={{ transformStyle: "preserve-3d" }}
                          className="w-full h-full relative"
                        >
                          {/* --- FRONT FACE (The Card Content) --- */}
                          <div
                            className="absolute inset-0 bg-black border border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.05)] overflow-hidden"
                            style={{ backfaceVisibility: "hidden" }}
                          >
                            {/* Card Image with Monochrome Filter */}
                            <img
                              src={getCardImageUrl(card.image)}
                              alt={card.nameEn}
                              onError={(e) => {
                                // Fallback to remote CDN if local image fails
                                const target = e.target as HTMLImageElement;
                                if (
                                  target.src !==
                                  getCardImageFallbackUrl(card.image)
                                ) {
                                  target.src = getCardImageFallbackUrl(
                                    card.image
                                  );
                                }
                              }}
                              className="w-full h-full object-cover"
                              style={{
                                filter:
                                  "grayscale(100%) contrast(1.2) brightness(0.9)",
                                mixBlendMode: "normal",
                              }}
                            />

                            {/* Gradient Overlay for Text Readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40" />

                            {/* Border Overlay */}
                            <div className="absolute inset-2 md:inset-3 border border-white/20 pointer-events-none" />

                            {/* Text Label */}
                            <div className="absolute bottom-0 w-full p-3 md:p-4 flex flex-col items-center text-center z-10">
                              <h2
                                className={`${
                                  spread === "SINGLE"
                                    ? "text-xl"
                                    : "text-[10px] md:text-sm"
                                } text-white font-cinzel tracking-widest mb-1 drop-shadow-md`}
                              >
                                {card.nameEn}
                              </h2>
                              <p
                                className={`${
                                  spread === "SINGLE"
                                    ? "text-base"
                                    : "text-[9px] md:text-[10px]"
                                } text-neutral-400 font-serif`}
                              >
                                {card.nameCn}{" "}
                                {card.isReversed && (
                                  <span className="text-red-400/80 opacity-80 inline-block ml-1">
                                    (逆位)
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>

                          {/* --- BACK FACE (The Design while flipping) --- */}
                          <div
                            className="absolute inset-0 bg-neutral-950 border border-white/20 shadow-2xl flex items-center justify-center"
                            style={{
                              backfaceVisibility: "hidden",
                              transform: "rotateY(180deg)", // Back face is rotated 180 relative to front
                            }}
                          >
                            <div
                              className="absolute inset-0 opacity-20"
                              style={{
                                backgroundImage:
                                  "radial-gradient(circle, #fff 1px, transparent 1px)",
                                backgroundSize: "6px 6px",
                              }}
                            ></div>
                            <div className="absolute inset-2 border border-white/5" />
                            <div className="w-8 h-8 border border-white/10 rotate-45" />
                          </div>
                        </motion.div>

                        {/* Card Position Label (Static, outside the flip) */}
                        {spread === "THREE" && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5 + index * 0.3 }}
                            className="absolute -bottom-6 md:-bottom-8 w-full text-center text-[8px] md:text-[9px] tracking-[0.2em] text-neutral-600 uppercase"
                          >
                            {index === 0
                              ? "Past"
                              : index === 1
                              ? "Present"
                              : "Future"}
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* Reading Text / Loading State */}
                  <div className="w-full max-w-2xl min-h-[150px] flex flex-col items-center justify-center text-center pb-12">
                    <AnimatePresence mode="wait">
                      {/* Loading Indicator with Card Keywords */}
                      {isThinking && (
                        <motion.div
                          key="thinking"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col gap-8 items-center w-full max-w-xl px-4"
                        >
                          {/* Card Keywords Preview */}
                          <div className="flex flex-col gap-4 w-full">
                            {pickedCards.map((card, index) => (
                              <motion.div
                                key={card.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  delay: index * 0.2,
                                  duration: 0.6,
                                }}
                                className="flex flex-col gap-2 text-left border-l border-white/10 pl-4"
                              >
                                <div className="flex items-baseline gap-2">
                                  <span className="text-xs tracking-wider text-neutral-400">
                                    {card.nameCn}
                                  </span>
                                  {card.isReversed && (
                                    <span className="text-[8px] tracking-widest text-neutral-600">
                                      逆位
                                    </span>
                                  )}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {card.keywords
                                    .slice(0, 4)
                                    .map((keyword, i) => (
                                      <span
                                        key={i}
                                        className="text-[10px] tracking-wider text-neutral-500 px-2 py-1 border border-white/5 bg-white/5"
                                      >
                                        {keyword}
                                      </span>
                                    ))}
                                </div>
                              </motion.div>
                            ))}
                          </div>

                          {/* Animated Dots */}
                          <div className="flex items-center gap-2">
                            <p className="text-xs tracking-[0.2em] text-neutral-500">
                              CONSULTING THE SAGE
                            </p>
                            <div className="flex gap-1">
                              {[0, 1, 2].map((i) => (
                                <motion.span
                                  key={i}
                                  className="text-neutral-500"
                                  animate={{ opacity: [0.2, 1, 0.2] }}
                                  transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    delay: i * 0.3,
                                  }}
                                >
                                  .
                                </motion.span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* The Reading Text */}
                      {!isThinking && gameState === GameState.READING && (
                        <motion.div
                          id="reading-content"
                          key="text-content"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 1, ease: SILKY_EASE }}
                          className="relative px-4 md:px-0 max-h-[60vh] overflow-y-auto"
                          style={{
                            scrollbarWidth: "thin",
                            scrollbarColor: "rgba(255,255,255,0.2) transparent",
                          }}
                        >
                          <style>{`
                            #reading-content::-webkit-scrollbar {
                              width: 6px;
                            }
                            #reading-content::-webkit-scrollbar-track {
                              background: transparent;
                            }
                            #reading-content::-webkit-scrollbar-thumb {
                              background: rgba(255,255,255,0.2);
                              border-radius: 3px;
                            }
                            #reading-content::-webkit-scrollbar-thumb:hover {
                              background: rgba(255,255,255,0.3);
                            }
                          `}</style>
                          {question && (
                            <p className="text-xs text-neutral-600 mb-4 tracking-widest uppercase">
                              Reflecting on: "{question}"
                            </p>
                          )}
                          <div className="w-12 h-[1px] bg-white/20 mx-auto mb-6" />
                          <p className="text-base md:text-xl leading-loose text-neutral-300 font-light font-serif tracking-wide mb-12 max-w-xl mx-auto text-justify md:text-center">
                            {readingText}
                          </p>

                          {/* Action Buttons */}
                          <div className="flex items-center justify-center gap-4 mb-8">
                            {/* Replay Audio Button */}
                            {readingAudioBuffer && (
                              <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 2 }}
                                onClick={replayAudio}
                                disabled={isAudioPlaying}
                                className="inline-flex items-center gap-2 text-xs tracking-[0.2em] text-neutral-600 hover:text-white transition-colors group px-4 py-2 border border-neutral-800 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="重播解读音频"
                              >
                                <Volume2
                                  size={14}
                                  className={
                                    isAudioPlaying ? "animate-pulse" : ""
                                  }
                                />
                                REPLAY
                              </motion.button>
                            )}

                            {/* Download Image Button */}
                            <motion.button
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 2.2 }}
                              onClick={downloadReading}
                              className="inline-flex items-center gap-2 text-xs tracking-[0.2em] text-neutral-600 hover:text-white transition-colors group px-4 py-2 border border-neutral-800 hover:border-white/20"
                              title="下载解读图片"
                            >
                              <Download size={14} />
                              SAVE
                            </motion.button>
                          </div>

                          <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 3 }} // Show reset button late
                            onClick={resetRitual}
                            className="inline-flex items-center gap-3 text-xs tracking-[0.2em] text-neutral-600 hover:text-white transition-colors group px-6 py-2 border border-transparent hover:border-white/10"
                          >
                            <RefreshCw
                              size={12}
                              className="group-hover:rotate-180 transition-transform duration-700"
                            />
                            SEEK AGAIN
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
          </AnimatePresence>
        </div>
      </main>

      {/* Creator Credit */}
      <div className="fixed bottom-4 right-6 z-50 text-[9px] text-neutral-600 font-sans tracking-widest opacity-50 select-none pointer-events-none mix-blend-difference">
        Created by 范松海frank
      </div>
    </div>
  );
};

export default App;
