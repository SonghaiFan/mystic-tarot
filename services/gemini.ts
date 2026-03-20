import { GoogleGenAI } from "@google/genai";
import { SpreadType, PickedCard, Locale } from "../types";
import { SPREADS, getLocalizedSpread } from "../constants/spreads";
import i18n from "../i18n/config";

// Helper to create a fresh client instance (important for key updates)
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Audio Helper Functions ---

// Decode Base64 string to Uint8Array
const base64ToBytes = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const length = binaryString.length;
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

// Convert raw PCM (Int16) to AudioBuffer
// Gemini 2.5 Flash TTS returns raw PCM 16-bit mono at 24kHz
const pcmToAudioBuffer = (
  pcmData: Uint8Array,
  audioContext: AudioContext,
  sampleRate: number = 24000
): AudioBuffer => {
  // Convert 16-bit PCM to Float32
  const float32Data = new Float32Array(pcmData.length / 2);
  const dataView = new DataView(pcmData.buffer);

  for (let i = 0; i < pcmData.length / 2; i++) {
    // Little endian
    const int16 = dataView.getInt16(i * 2, true);
    // Normalize to [-1, 1]
    float32Data[i] = int16 / 32768;
  }

  const audioBuffer = audioContext.createBuffer(
    1,
    float32Data.length,
    sampleRate
  );
  audioBuffer.getChannelData(0).set(float32Data);
  return audioBuffer;
};

// Load pre-generated MP3 audio from local file
const loadLocalAudio = async (
  filename: string,
  audioContext: AudioContext
): Promise<AudioBuffer | null> => {
  try {
    const baseUrl = import.meta.env.BASE_URL;
    const response = await fetch(`${baseUrl}audio/${filename}`);
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
  question: string,
  locale: Locale
): Promise<string> => {
  try {
    const ai = getAiClient();
    const spreadConfig = getLocalizedSpread(spread, locale);
    const t = i18n.getFixedT(locale);

    const cardDetails = cards
      .map((c, i) => {
        let position = `Position ${i + 1}`;
        if (spreadConfig.layoutType === "absolute" && spreadConfig.positions) {
          position = spreadConfig.positions[i]?.label || position;
        } else if (spreadConfig.labels) {
          position = spreadConfig.labels[i] || position;
        }

        const meaningHints =
          locale === "en"
            ? c.descriptionEn || c.descriptionCn || ""
            : (c.isReversed ? c.negative : c.positive) ||
              c.descriptionCn ||
              c.descriptionEn ||
              "";

        const orientation =
          locale === "en"
            ? c.isReversed
              ? "REVERSED"
              : "UPRIGHT"
            : c.isReversed
              ? "REVERSED (逆位)"
              : "UPRIGHT (正位)";

        const title =
          locale === "en"
            ? `${c.nameEn}${c.nameCn ? ` (${c.nameCn})` : ""}`
            : `${c.nameCn} (${c.nameEn})`;

        const keywordLine =
          locale === "en" ? "" : `\n        - Core Keywords: ${c.keywords.join(", ")}`;

        return `Card ${i + 1} [${position}]: ${title}
        - Orientation: ${orientation}${keywordLine}
        ${meaningHints ? `- Meaning Hints: ${meaningHints}` : ""}`;
      })
      .join("\n");

    const spreadContext = spreadConfig.interpretationInstruction;

    const userQuestion = question.trim()
      ? `Seeker's Question: "${question}"`
      : locale === "en"
        ? "Seeker's Question: General guidance for the path ahead."
        : "Seeker's Question: 关于接下来道路的综合指引。";

    const prompt =
      locale === "en"
        ? `
      Role: You are a Grand Tarot Master and ancient sage.
      Your voice is mystical, emotionally intelligent, and grounded rather than theatrical.
      You interpret spreads by how the card positions interact, not by listing separate dictionary meanings.

      Task: Provide a Tarot reading for the seeker based on the following details.

      ${userQuestion}

      ${spreadContext}

      Cards Drawn:
      ${cardDetails}

      Strict Interpretation Guidelines:
      1. Upright vs. Reversed:
         - Upright means energy that is active, direct, or clearly manifest.
         - Reversed does NOT automatically mean bad. It may indicate blocked energy, delay, inner conflict, internalization, or excess.

      2. Context:
         - Connect the reading directly to the seeker's specific question.
         - Avoid generic textbook meanings.

      3. **Narrative Flow & Synthesis:**
         - Do not list cards one by one like a dictionary.
         - Weave them into a single, fluid story or message.
         - Mention elemental harmony or tension only if it naturally helps the reading.

      4. **Tone & Format:**
         - Language: English.
         - Format: One cohesive paragraph. No bullet points. No card-by-card numbering.
         - Speak directly to "you".
         - End with a short empowering line or mantra, without a label.
         - Length: 130-180 words.

      Start your interpretation immediately.
    `
        : `
      Role: 你是一位塔罗大师与古老智者。
      你的声音应当深邃、神秘、富有同理心，同时保持清晰与稳重。
      你解读牌阵时要关注牌位之间的互动，而不是把每张牌拆成字典式定义。

      Task: 请根据以下信息，为求问者提供一段塔罗解读。

      ${userQuestion}

      ${spreadContext}

      Cards Drawn:
      ${cardDetails}

      Strict Interpretation Guidelines:
      1. 正位与逆位：
         - 正位代表外显、流动、主动或充分显化的能量。
         - 逆位不等于“坏”，也可以表示内化、阻滞、延迟、过度，或需要先反思再行动。

      2. 贴合问题：
         - 必须直接回应求问者的问题与处境。
         - 不要给泛泛而谈的牌义解释。

      3. 叙事与综合：
         - 不要逐张牌拆开说明。
         - 请把它们编织成一段完整、流动、有连贯性的解读。
         - 如果合适，可以提到元素之间的助力或冲突。

      4. 语气与格式：
         - 语言：简体中文。
         - 格式：一整段完整文字，不要项目符号，不要写“第一张牌表示……”。
         - 直接对“你”说话。
         - 结尾给一句简短但有力量的建议或箴言，不要加前缀。
         - 长度：120-180字。

      直接开始解读。
    `;

    console.log("Tarot Reading Prompt:", prompt);

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      // model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 1.0,
      },
    });
    return response.text || t("errors.readingSoftFail");
  } catch (error) {
    console.warn("Text generation warning:", error);
    return i18n.getFixedT(locale)("errors.readingHardFail");
  }
};

export const generateSpeech = async (
  text: string,
  audioContext: AudioContext,
  staticKey?: string,
  locale: Locale = "zh-CN"
): Promise<AudioBuffer | null> => {
  if (!text) return null;

  if (staticKey && locale === "zh-CN") {
    const localAudio = await loadLocalAudio(`${staticKey}.mp3`, audioContext);
    if (localAudio) {
      return localAudio;
    }
    console.warn(`本地音频不可用: ${staticKey}`);
  }

  // 2. Try Gemini TTS
  try {
    const ai = getAiClient();
    // Use the specific TTS model

    console.log("Gemini TTS text:", text);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-ttss",
      contents: [
        {
          parts: [
            {
              // Add the voice description to your text prompt
              text:
                "Use deep, mystical, and empathetic voice suitable for an old sage/tarot master, say the following: " +
                text,
            },
          ],
        },
      ],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Enceladus" },
          },
        },
      },
    });

    const base64Audio =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (base64Audio) {
      const pcmBytes = base64ToBytes(base64Audio);
      // Ensure we pass the correct sample rate for the model (24000Hz)
      return pcmToAudioBuffer(pcmBytes, audioContext, 24000);
    }
    console.warn("No audio data in response");
    return null;
  } catch (error) {
    // Log warning for quota/server errors, return null so app stays silent
    console.warn(
      "Gemini TTS unavailable (quota or server busy). Staying silent.",
      error
    );
    return null;
  }
};

export const predictBestSpread = async (
  question: string,
  locale: Locale
): Promise<SpreadType> => {
  try {
    const ai = getAiClient();

    const spreadList = Object.values(SPREADS)
      .map((s) => {
        const localized = getLocalizedSpread(s.id, locale);
        return `- ${localized.id}: ${localized.name} (${localized.description})`;
      })
      .join("\n");

    const prompt = `
      Role: You are a deeply intuitive Tarot Guide.
      Task: Analyze the user's question and select the ONE most appropriate Tarot Spread from the list below.
      
      User Question: "${question}"
      
      Available Spreads:
      ${spreadList}
      
      Instructions:
      - If the question involves time/trends, prefer TIMELINE or YEARLY.
      - If the question involves love/partnerships, prefer RELATION.
      - If the question is about self-discovery, prefer COURT, FIVE, or DIMENSION.
      - If the question is simple or broad, prefer SINGLE or THREE.
      - If the question is about decision making, prefer FOUR (Simple Four).
      - If the question is about goals or career, prefer GOALS, TIMELINE, or YEARLY.
      
      Return ONLY the ID of the spread (e.g. "RELATION"). Do not add any explanation or extra text.
    `;

    console.log("Predict Spread Prompt:", prompt);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: prompt,
      config: {
        temperature: 0.3,
      },
    });

    const text = response.text?.trim().toUpperCase() || "SINGLE";

    if (Object.keys(SPREADS).includes(text)) {
      return text as SpreadType;
    }
    return "SINGLE";
  } catch (error) {
    console.warn("Spread prediction failed, defaulting to SINGLE", error);
    return "SINGLE";
  }
};
