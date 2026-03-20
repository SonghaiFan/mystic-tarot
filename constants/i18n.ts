import { Locale } from "../types";

export const DEFAULT_LOCALE: Locale = "zh-CN";
export const LOCALE_STORAGE_KEY = "mystic-tarot-locale";

export const UI_TEXT = {
  "zh-CN": {
    appTitle: "Mystic Tarot | 命运塔罗",
    intro: {
      focus: "命 运",
      subtitle: "TAROT",
      enter: "ENTER THE VOID 开始占卜",
    },
    header: {
      brand: "MYSTIC塔罗",
      library: "牌库",
      back: "返回",
      openLibraryTitle: "打开牌库",
      closeLibraryTitle: "关闭牌库",
      fullscreen: "全屏",
      exitFullscreen: "退出全屏",
      stateLabels: {
        INTRO: "",
        LIBRARY: "牌库",
        INPUT: "Step 1 · 提问与牌阵",
        SHUFFLING: "Step 2 · 洗牌",
        PICKING: "Step 3 · 抽牌",
        REVEAL: "Step 4 · 解读",
        READING: "Step 4 · 解读",
      },
    },
    input: {
      chooseSpread: "选择牌阵",
      chooseSpreadHint:
        "牌阵决定解读角度：感情、决策、全局扫描、关系镜像……先选对牌阵再发问。",
      confirmSpread: "CONFIRM SPREAD 确认牌阵",
      selectSpread: "SELECT A SPREAD",
      reselect: "RESELECT 重新选择牌阵",
      selectedSpread: "已选择「{name}」牌阵",
      meditation:
        "请闭上双眼，深呼吸三次\n在心中默念你的困惑，保持虔诚与专注",
      enterQuestion: "输入你的问题",
      fallbackPlaceholder: "在此输入你心中的疑惑...",
      beginRitual: "BEGIN RITUAL 开始洗牌",
      divining: "DIVINING... 感知中",
    },
    picking: {
      instruction: "轻点任意卡牌，直到下方格子亮满（共 {count} 张）",
    },
    shuffling: {
      title: "洗牌中（稍后抽取 {count} 张牌）",
      subtitle: "保持呼吸，准备点击任意漂浮的卡牌。",
    },
    reading: {
      revealPrompt: "翻开每一张卡牌以显示解读",
      questionPrefix: "正在回应：",
      replay: "REPLAY 再念一次",
      replayTitle: "重播解读音频",
      save: "SAVE 保存图文",
      saveTitle: "下载解读图片",
      prompt: "PROMPT 提示词",
      promptTitle: "复制给其他 AI 的提示词",
      copied: "COPIED 复制成功",
      seekAgain: "SEEK AGAIN 再次探索",
      thinkingPhrases: [
        "正在向群星求问……",
        "正在编织命运的丝线……",
        "正在聆听低语……",
        "正在校准宇宙回响……",
      ],
      copyPrompt: {
        defaultQuestion: "综合指引",
        positionFallback: "卡牌",
        title: "我使用「{spreadName}」牌阵完成了一次塔罗解读。",
        question: "问题：{question}",
        cardsDrawn: "抽到的牌：",
        initialInterpretation: "当前解读：",
        request:
          "请基于这些内容，继续给出更深入、更细致的分析，重点关注牌与牌之间的隐藏联系，以及可执行的现实建议。",
      },
    },
    deck: {
      title: "塔罗牌库",
      categories: {
        FULL: "全部牌",
        MAJOR: "大阿尔卡那",
        SUIT_WANDS: "权杖",
        SUIT_CUPS: "圣杯",
        SUIT_SWORDS: "宝剑",
        SUIT_PENTACLES: "星币",
      },
    },
    tooltip: {
      clickToReveal: "点击翻牌",
      clickForDetails: "点击查看详细内容",
    },
    card: {
      reversedShort: "逆位",
      reversedLong: "逆位",
      interpretationTitle: "牌义启示",
      chineseInsight: "中文解读",
      englishInsight: "英文解读",
      keywords: "关键词",
    },
    print: {
      title: "塔罗解读",
      subtitle: "TAROT READING",
      questionLabel: "你的问题",
      interpretationLabel: "解读",
      filename: "tarot-reading",
      dateLocale: "zh-CN",
    },
    staticScripts: {
      WELCOME: "静心凝视深渊。当你的直觉苏醒时，进入命运之门。",
      ASK: "心中的疑惑，是通往真理的钥匙。告诉我，你为何而来？",
      SHUFFLE: "星辰正在归位，混乱中孕育着秩序。专注于你的问题。",
      PICK: "在流动的命运中，选择你的指引。",
      REVEAL: "这就是，命运的回响。",
    },
    errors: {
      readingSoftFail: "迷雾太浓，我看不到前路...",
      readingHardFail: "命运的丝线暂时纠缠不清，请静心片刻后再试。",
      silentStars: "星象暂时沉默，请稍后再试。",
    },
  },
  en: {
    appTitle: "Mystic Tarot",
    intro: {
      focus: "MYSTIC TAROT",
      subtitle: "DIVINATION",
      enter: "ENTER THE VOID",
    },
    header: {
      brand: "MYSTIC TAROT",
      library: "Library",
      back: "Back",
      openLibraryTitle: "Open library",
      closeLibraryTitle: "Close library",
      fullscreen: "Fullscreen",
      exitFullscreen: "Exit Fullscreen",
      stateLabels: {
        INTRO: "",
        LIBRARY: "Library",
        INPUT: "Step 1 · Question & Spread",
        SHUFFLING: "Step 2 · Shuffle",
        PICKING: "Step 3 · Draw",
        REVEAL: "Step 4 · Reading",
        READING: "Step 4 · Reading",
      },
    },
    input: {
      chooseSpread: "Choose your spread",
      chooseSpreadHint:
        "The spread shapes the reading: love, decisions, life scans, relationship mirrors. Choose the right layout before you ask.",
      confirmSpread: "CONFIRM SPREAD",
      selectSpread: "SELECT A SPREAD",
      reselect: "RESELECT SPREAD",
      selectedSpread: "Selected spread: {name}",
      meditation:
        "Close your eyes and take three deep breaths.\nHold your question in your mind with sincerity and focus.",
      enterQuestion: "Enter your question",
      fallbackPlaceholder: "Type the question resting on your heart...",
      beginRitual: "BEGIN RITUAL",
      divining: "DIVINING...",
    },
    picking: {
      instruction: "Tap any floating card until all {count} slots below are lit.",
    },
    shuffling: {
      title: "Shuffling... you will draw {count} card(s) soon.",
      subtitle: "Keep breathing and prepare to choose from the drifting cards.",
    },
    reading: {
      revealPrompt: "Reveal every card to unlock the reading",
      questionPrefix: "Reflecting on:",
      replay: "REPLAY AUDIO",
      replayTitle: "Replay the reading audio",
      save: "SAVE IMAGE",
      saveTitle: "Download the reading as an image",
      prompt: "COPY PROMPT",
      promptTitle: "Copy a follow-up prompt for another AI",
      copied: "COPIED",
      seekAgain: "SEEK AGAIN",
      thinkingPhrases: [
        "Consulting the stars...",
        "Weaving the threads of fate...",
        "Listening for the whisper...",
        "Aligning with the cosmos...",
      ],
      copyPrompt: {
        defaultQuestion: "General guidance",
        positionFallback: "Card",
        title: 'I did a tarot reading using the "{spreadName}" spread.',
        question: "Question: {question}",
        cardsDrawn: "Cards Drawn:",
        initialInterpretation: "Initial Interpretation:",
        request:
          "Please give a deeper and more detailed analysis of this reading, focusing on hidden connections between the cards and practical advice.",
      },
    },
    deck: {
      title: "Tarot Deck Library",
      categories: {
        FULL: "All Cards",
        MAJOR: "Major Arcana",
        SUIT_WANDS: "Wands",
        SUIT_CUPS: "Cups",
        SUIT_SWORDS: "Swords",
        SUIT_PENTACLES: "Pentacles",
      },
    },
    tooltip: {
      clickToReveal: "Click to Reveal",
      clickForDetails: "Click to see more details",
    },
    card: {
      reversedShort: "Rev",
      reversedLong: "Reversed",
      interpretationTitle: "Interpretation",
      chineseInsight: "Chinese Insight",
      englishInsight: "English Insight",
      keywords: "Keywords",
    },
    print: {
      title: "Tarot Reading",
      subtitle: "MYSTIC TAROT",
      questionLabel: "Your Question",
      interpretationLabel: "Interpretation",
      filename: "tarot-reading",
      dateLocale: "en-US",
    },
    staticScripts: {
      WELCOME:
        "Be still and gaze into the void. When your intuition awakens, step through the gate of fate.",
      ASK:
        "The question in your heart is the key to truth. Tell me, what are you seeking?",
      SHUFFLE:
        "The stars are returning to their places. Order is forming within the chaos. Focus on your question.",
      PICK: "From the moving currents of fate, choose your guides.",
      REVEAL: "Now it appears. The echo of destiny.",
    },
    errors: {
      readingSoftFail: "The mist is too dense for me to see the path ahead...",
      readingHardFail:
        "The threads of fate are tangled for the moment. Please breathe and try again shortly.",
      silentStars: "The stars are silent for now. Please try again in a moment.",
    },
  },
} as const satisfies Record<Locale, any>;

export const LANGUAGE_LABELS: Record<Locale, string> = {
  "zh-CN": "中文",
  en: "EN",
};

export const formatMessage = (
  template: string,
  values: Record<string, string | number>
) =>
  Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template
  );

