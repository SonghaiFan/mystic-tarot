import { GoogleGenAI } from "@google/genai";
import { TarotCard, SpreadType, PickedCard } from "../types";

// Helper to create a fresh client instance (important for key updates)
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Audio Helper Functions ---

// Load pre-generated MP3 audio from local file
const loadLocalAudio = async (
  filename: string,
  audioContext: AudioContext
): Promise<AudioBuffer | null> => {
  try {
    const response = await fetch(`/audio/${filename}`);
    if (!response.ok) {
      console.warn(`本地音频文件不存在: ${filename}`);
      return null;
    }
    const arrayBuffer = await response.arrayBuffer();
    // Decode MP3 using Web Audio API
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
  } catch (error) {
    console.warn(`加载本地音频失败: ${filename}`, error);
    return null;
  }
};

// --- API Functions ---

export const generateTarotReading = async (
  cards: PickedCard[],
  spread: SpreadType,
  question: string
): Promise<string> => {
  try {
    const ai = getAiClient();
    // Include keywords to help ground the model's knowledge
    const cardDetails = cards
      .map((c, i) => {
        const position =
          spread === "THREE"
            ? i === 0
              ? "Past"
              : i === 1
              ? "Present"
              : "Future"
            : "Advice";
        return `Card ${i + 1} [${position}]: ${c.nameCn} (${c.nameEn})
        - Orientation: ${c.isReversed ? "REVERSED (逆位)" : "UPRIGHT (正位)"}
        - Core Keywords: ${c.keywords.join(", ")}`;
      })
      .join("\n");

    const spreadContext =
      spread === "THREE"
        ? "Spread Type: Three Card Spread (Past / Present / Future). Use this time flow to structure your answer."
        : "Spread Type: Single Card Oracle (Direct Guidance). Focus entirely on the essence of this single card.";

    const userQuestion = question.trim()
      ? `Seeker's Question: "${question}"`
      : "Seeker's Question: General guidance for the path ahead.";

    const prompt = `
      Role: You are a Grand Tarot Master and Ancient Sage (塔罗大师 / 智者). 
      Your voice is deep, mystical, and empathetic, but grounded in centuries of occult knowledge.

      Task: Provide a Tarot reading for the seeker based on the following details.

      ${userQuestion}
      
      ${spreadContext}
      
      Cards Drawn:
      ${cardDetails}

      Strict Interpretation Guidelines:
      1. **Upright vs. Reversed (Crucial):**
         - If a card is **Upright (正位)**: Interpret its energy as external, flowing, active, or fully manifested.
         - If a card is **Reversed (逆位)**: Do NOT just say it is "bad". Interpret it as:
           * Internalized energy (happening inside the seeker's mind).
           * Blocked or delayed energy.
           * The need to reflect before acting.
           * Or the excess/extreme version of the upright meaning.
           * *Example:* Strength Reversed is not weakness, but self-doubt or struggling to find inner resolve.
      
      2. **Contextualize to Question:** 
         - Connect the card meanings DIRECTLY to the Seeker's specific question (Love, Career, Life, etc.).
         - Do not give generic definitions. Apply the symbolism to their specific situation.
      
      3. **Narrative Flow:**
         - Do not list cards one by one like a dictionary.
         - Weave them into a single, fluid story or message.
         - If it is a Past/Present/Future spread, explain the progression of events.

      4. **Tone & Format:**
         - Language: Chinese (Simplified) - Poetic, Deep, Insightful.
         - Format: ONE single cohesive paragraph. No bullet points. No "Card 1 says...".
         - Speak directly to "You" (你).
         - Length: 120-160 words.
      
      Start your interpretation immediately.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        temperature: 1.0,
      },
    });
    return response.text || "迷雾太浓，我看不到前路...";
  } catch (error) {
    // If quota exceeded for text generation, return fallback text
    console.warn("Text generation warning:", error);
    return "命运的丝线暂时纠缠不清，请静心片刻后再试。";
  }
};

export const generateSpeech = async (
  text: string,
  audioContext: AudioContext,
  staticKey?: string // 可选: 'welcome' | 'ask' | 'shuffle' | 'pick' | 'reveal'
): Promise<AudioBuffer | null> => {
  if (!text) return null;

  // 只加载本地预生成的音频文件
  if (staticKey) {
    const localAudio = await loadLocalAudio(`${staticKey}.mp3`, audioContext);
    if (localAudio) {
      return localAudio;
    }
    console.warn(`本地音频不可用: ${staticKey}`);
  }

  // 不再使用 Gemini TTS API，所有语音都必须预先生成
  console.warn("没有可用的音频文件");
  return null;
};
