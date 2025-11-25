import { GoogleGenAI } from "@google/genai";
import { TarotCard, SpreadType, PickedCard } from "../types";
import { SPREADS } from "../constants/spreads";

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
  question: string
): Promise<string> => {
  try {
    const ai = getAiClient();
    const spreadConfig = SPREADS[spread];

    // Include keywords to help ground the model's knowledge
    const cardDetails = cards
      .map((c, i) => {
        let position = `Position ${i + 1}`;
        if (spreadConfig.layoutType === "absolute" && spreadConfig.positions) {
          position = spreadConfig.positions[i]?.label || position;
        } else if (spreadConfig.labels) {
          position = spreadConfig.labels[i] || position;
        }

        const description = c.isReversed ? c.negative : c.positive;

        return `Card ${i + 1} [${position}]: ${c.nameCn} (${c.nameEn})
        - Orientation: ${c.isReversed ? "REVERSED (逆位)" : "UPRIGHT (正位)"}
        - Core Keywords: ${c.keywords.join(", ")}
        ${description ? `- Meaning Hints: ${description}` : ""}`;
      })
      .join("\n");

    const spreadContext = spreadConfig.interpretationInstruction;

    const userQuestion = question.trim()
      ? `Seeker's Question: "${question}"`
      : "Seeker's Question: General guidance for the path ahead.";

    const prompt = `
      Role: You are a Grand Tarot Master and Ancient Sage (塔罗大师 / 智者). 
      Your voice is deep, mystical, and empathetic, but grounded in centuries of occult knowledge.
      You are interpreting the cards based on the "Handbook of Tarot Spreads" methodology, focusing on the interplay between positions, not just isolated meanings.

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
      
      2. **Contextualize to Question:** 
         - Connect the card meanings DIRECTLY to the Seeker's specific question (Love, Career, Life, etc.).
         - Do not give generic definitions. Apply the symbolism to their specific situation.
      
      3. **Narrative Flow & Synthesis:**
         - **Do not list cards one by one like a dictionary.**
         - Weave them into a single, fluid story or message.
         - Look for "Elemental Dignities" (e.g., Fire and Water clashing, or Air and Fire fueling each other) if relevant.
         - For a single-card draw: Upright indicates “yes”, reversed indicates “no”. Provide deeper insight by refining the question and examining how the drawn card aligns with it.
         - If it is a Celtic Cross, focus heavily on the "Cross" (Center) vs the "Staff" (Right side).
         - For a Court Card Spread, use: “When this situation arises, you become… because…”

      4. **Tone & Format:**
         - Language: Chinese (Simplified) - Poetic, Deep, Insightful.
         - Format: ONE single cohesive paragraph. No bullet points. No "Card 1 says..."
         - Speak directly to "You" (你).
         - End with a short, empowering piece of advice or a "mantra" for the seeker. but NO prefix.
         - Length: 120-160 words.
      
      Start your interpretation immediately.
    `;

    console.log("Tarot Reading Prompt:", prompt);

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview-fsh",
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

  // 1. Try Local Audio (if staticKey provided)
  if (staticKey) {
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
      model: "gemini-2.5-flash-preview-tts-fsh",
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
