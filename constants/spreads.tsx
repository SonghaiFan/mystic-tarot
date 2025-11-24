import React from "react";
import { SpreadType, CardPoolType } from "../types";

export interface SpreadPosition {
  x: number | string; // Percentage (0-100) or specific unit (e.g. "50px")
  y: number | string; // Percentage (0-100) or specific unit (e.g. "50px")
  label: string;
  rotation?: number; // Degrees
  labelPosition?: "top" | "bottom" | "left" | "right";
  zIndex?: number;
}

export interface SpreadDefinition {
  id: SpreadType;
  name: string;
  description: string;
  cardCount: number;
  layoutType: "flex" | "absolute";
  positions?: SpreadPosition[]; // For absolute layouts
  labels?: string[]; // For flex layouts
  cardPools?: CardPoolType[]; // Specific pool for each position. Defaults to FULL if undefined.
  cardSize: {
    mobile: string; // Tailwind classes
    desktop: string; // Tailwind classes
  };
  icon: (isActive: boolean) => React.ReactNode;
  interpretationInstruction: string;
  defaultQuestions?: string[];
}

export const SPREADS: Record<SpreadType, SpreadDefinition> = {
  SINGLE: {
    id: "SINGLE",
    name: "One Card Oracle",
    description:
      "适合日常能量扫描、需要快速方向感的是否提问（正位=是，逆位=否）。建议用开放式问题效果更佳。\n与其只问“我应该在二月休假吗？”，不如改问“关于在二月休年假，我需要留意什么？”",
    cardCount: 1,
    layoutType: "flex",
    labels: ["Insight"],
    cardPools: ["MAJOR"],
    cardSize: {
      mobile: "w-64 aspect-[300/519]",
      desktop: "w-80 aspect-[300/519]",
    },
    icon: (isActive) => (
      <div
        className={`w-3 h-5 border rounded-[1px] transition-all duration-300 ${
          isActive
            ? "bg-white/90 border-transparent shadow-[0_0_8px_rgba(255,255,255,0.4)]"
            : "border-white/40"
        }`}
      />
    ),
    interpretationInstruction:
      "Spread Type: Single Card Oracle (Direct Guidance). Focus entirely on the essence of this single card.",
    defaultQuestions: [
      "How can I benefit from this situation?",
      "我如何从目前的状况中获益？",
      "Is this a good and fair deal?",
      "今天采取什么样的态度最有用？",
      "What attitude will be most useful to adopt today?",
      "我能从这个问题中学到什么？",
      "What can I learn from this problem?",
      "处理这种情况的最佳方式是什么？",
      "What’s the best way of dealing with this situation?",
    ],
  },
  THREE: {
    id: "THREE",
    name: "Past · Present · Future",
    description:
      "Past · Present · Future：梳理事件的起因、现状与走向。\n提问时可用“我需要了解什么？”并在适当时加入时间范围。",
    cardCount: 3,
    layoutType: "flex",
    labels: ["Past", "Present", "Future"],
    cardPools: ["MAJOR", "MAJOR", "MAJOR"],
    cardSize: {
      mobile: "w-28 aspect-[300/519]",
      desktop: "w-56 aspect-[300/519]",
    },
    icon: (isActive) => (
      <div className="flex gap-0.5 items-center">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`w-2 h-3.5 border rounded-[1px] transition-all duration-300 ${
              isActive ? "bg-white/90 border-transparent" : "border-white/40"
            } ${i === 1 ? "-translate-y-0.5" : "translate-y-0.5"}`}
          />
        ))}
      </div>
    ),
    interpretationInstruction:
      "Spread Type: Three Card Spread (Past / Present / Future). Use this time flow to structure your answer.",
    defaultQuestions: [
      "这段关系的发展趋势是怎样的？",
      "What do I need to know about my health this weekend?",
      "这个周末我的健康状况如何？",
      "What do I need to know about my finances over the next month?",
      "下个月我的财务状况需要注意什么？",
      "What do I need to know about my work during this week ahead?",
      "这一周我的工作运势如何？",
    ],
  },
  FOUR: {
    id: "FOUR",
    name: "Four Card Clarity",
    description:
      "Situation · Cons · Pro · Answer. 获得对现状、阻碍、助力及结果的清晰指引。\n适合在感到困惑、需要权衡利弊或寻找突破口时使用。",
    cardCount: 4,
    layoutType: "flex",
    labels: ["Situation", "Cons", "Pro", "Answer"],
    cardSize: {
      mobile: "w-24 aspect-[300/519]",
      desktop: "w-36 aspect-[300/519]",
    },
    icon: (isActive) => (
      <div className="flex gap-0.5 items-center">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-1.5 h-3 border rounded-[1px] transition-all duration-300 ${
              isActive ? "bg-white/90 border-transparent" : "border-white/40"
            }`}
          />
        ))}
      </div>
    ),
    interpretationInstruction: `
      Spread Type: Four Card Clarity Spread.
      Analyze the cards in this specific sequence:
      1. **The Situation:** Insight into the current situation and the seeker's relationship to the question.
      2. **Cons (Obstacles):** What is working against the seeker? Challenges or hindrances.
      3. **Pro (Helpful Influences):** What is working in the seeker's favor? Positive effects or benefits.
      4. **The Answer (Outcome):** The likely outcome of the query based on current trends.
      
      Synthesize the "Cons" and "Pro" to provide balanced advice on how to navigate from the "Situation" to the best possible "Answer".
    `,
    defaultQuestions: [
      "未来三个月我的新恋情会如何发展？",
      "未来半年我的职业生涯需要注意什么？",
      "未来一年我的财务状况如何？",
      "我该如何让生活更有意义？",
    ],
  },
  FIVE: {
    id: "FIVE",
    name: "Five Card Insight",
    description:
      "Past · Present · Hidden · Advice · Outcome. 揭示潜意识影响与未来指引。\n适合探索复杂局面的深层原因，特别是当你觉得“有些事情我看不到”的时候。",
    cardCount: 5,
    layoutType: "flex",
    labels: ["Past", "Present", "Hidden", "Advice", "Outcome"],
    cardSize: {
      mobile: "w-20 aspect-[300/519]",
      desktop: "w-32 aspect-[300/519]",
    },
    icon: (isActive) => (
      <div className="flex gap-0.5 items-end">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`w-1.5 border rounded-[1px] transition-all duration-300 ${
              isActive ? "bg-white/90 border-transparent" : "border-white/40"
            } ${i === 2 ? "h-2.5" : "h-3"}`}
          />
        ))}
      </div>
    ),
    interpretationInstruction: `
      Spread Type: Five Card Insight Spread.
      This spread reveals the trajectory of a situation, including hidden influences and advice.
      
      1. **Past:** How past issues, origins, or emotional shaping affect the present situation.
      2. **Present:** The significant event or psychological influence currently making the biggest impression.
      3. **What's Hidden:** Unconscious driving forces, unknown aspects, or things hidden from others/self. Can be positive or negative.
      4. **Advice:** Direction for overcoming negative hidden influences or capitalizing on positive ones. Action required.
      5. **Outcome:** The most likely possibility, dependent on acknowledging hidden influences and following the advice.
      
      Focus on the "Hidden" card as the pivot point that connects the current state to the advice and outcome.
    `,
    defaultQuestions: [
      "我该如何处理当前面临的困境？",
      "这件事背后的隐性影响是什么？",
      "我需要采取什么行动来达成目标？",
      "这段关系未来的走向如何？",
    ],
  },
  COURT: {
    id: "COURT",
    name: "Court Card Spread",
    description:
      "Situation · Persona · Cause. 探索你在特定情境下的行为模式与深层原因。\n适合自我反思，了解“为什么我在这种情况下会这样反应？”",
    cardCount: 3,
    layoutType: "flex",
    labels: ["Situation", "Persona", "Cause"],
    cardPools: ["MINOR_PIP", "COURT", "MAJOR"],
    cardSize: {
      mobile: "w-24 aspect-[300/519]",
      desktop: "w-36 aspect-[300/519]",
    },
    icon: (isActive) => (
      <div className="flex gap-1 items-end">
        <div
          className={`w-1 h-2  transition-all duration-300 ${
            isActive ? "bg-white/90" : "bg-white/30"
          }`}
        />
        <div
          className={`w-1 h-2.5 transition-all duration-300 ${
            isActive ? "bg-white/90" : "bg-white/30"
          }`}
        />
        <div
          className={`w-1 h-3 transition-all duration-300 ${
            isActive ? "bg-white/90" : "bg-white/30"
          }`}
        />
      </div>
    ),
    interpretationInstruction: `
      Spread Type: Court Card Spread.
      This spread reveals your behavioral patterns in daily life.
      
      1. **Situation (Minor Arcana):** "When this situation arises..."
         - Represents a specific situation or aspect of daily life.
      
      2. **Persona (Court Card):** "I become..."
         - Represents the personality traits or role you adopt in that situation.
      
      3. **Cause (Major Arcana):** "Because of..."
         - Represents the underlying psychological cause, archetype, or life lesson driving this behavior.
      
      Synthesize the reading as: "When [Situation] arises, I become [Persona] because of [Cause]."
      Focus on the psychological link between the situation and the adopted persona.
    `,
    defaultQuestions: [
      "Tell me about the way I deal with situations in daily life.",
      "我在面对压力时会变成什么样？",
      "为什么我在工作中总是表现出这种性格？",
    ],
  },
  DIMENSION: {
    id: "DIMENSION",
    name: "Five Dimensions",
    description:
      "Romance · Finance · Mental · Career · Spirit. 全面扫描生活的五个核心维度。\n适合定期（如每月/每季度）的整体状态检查，或当你感觉生活失衡时使用。",
    cardCount: 5,
    layoutType: "flex",
    labels: ["Romance", "Finance", "Mental", "Career", "Spirit"],
    cardPools: [
      "SUIT_CUPS",
      "SUIT_PENTACLES",
      "SUIT_SWORDS",
      "SUIT_WANDS",
      "MAJOR",
    ],
    cardSize: {
      mobile: "w-20 aspect-[300/519]",
      desktop: "w-32 aspect-[300/519]",
    },
    icon: (isActive) => (
      <div className="relative w-6 h-6">
        {[0, 1, 2, 3, 4].map((i) => {
          const angle = i * 72; // 360 / 5
          // Place five small rects in a circular (radial) layout
          return (
            <div
              key={i}
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-[1px] transition-all duration-300 ${
                isActive ? "bg-white/90 border-transparent" : "bg-white/30"
              }`}
              style={{
                transform: `rotate(${angle}deg) translateY(-8px) rotate(-${angle}deg)`,
              }}
            />
          );
        })}
      </div>
    ),
    interpretationInstruction: `
      Spread Type: Five Dimensions Spread.
      This spread covers five key aspects of life. Analyze each card in its specific domain:
      
      1. **Romance (Heart):** Emotional state, relationships, and matters of the heart.
      2. **Finance (Pentacles):** Financial security, assets, material comfort, and prosperity.
      3. **Mental (Swords):** Mental state, clarity of thought, decision-making ability, and worries.
      4. **Career (Wands):** Work effectiveness, workplace relationships, and career progress.
      5. **Spirit (Yin Yang):** Spiritual connection, personal growth, and alignment with your higher path.
      
      Synthesize these five dimensions to provide a holistic view of the seeker's current life state.
    `,
    defaultQuestions: [
      "下个月我的生活重心应该放在哪里？",
      "我目前的整体能量状态如何？",
      "我在各个生活领域需要注意什么？",
      "如何平衡我的物质生活与精神追求？",
    ],
  },
  CELTIC: {
    id: "CELTIC",
    name: "Celtic Cross",
    description:
      "The Ancient Standard. 凯尔特十字，最经典的十张牌深度解读。\n适合重大人生转折、极其复杂的问题，或需要全方位深层洞察的时刻。",
    cardCount: 10,
    layoutType: "absolute",
    positions: [
      // The Cross
      { x: 35, y: 50, label: "Present", zIndex: 10 },
      { x: 35, y: 50, label: "Challenge", rotation: 90, zIndex: 20 },
      { x: 35, y: 85, label: "Foundation", labelPosition: "bottom" },
      { x: 10, y: 50, label: "Past", labelPosition: "left" },
      { x: 35, y: 15, label: "Crown", labelPosition: "top" },
      { x: 60, y: 50, label: "Future", labelPosition: "right" },
      // The Staff
      { x: 85, y: 85, label: "Self", labelPosition: "right" },
      { x: 85, y: 65, label: "Environment", labelPosition: "right" },
      { x: 85, y: 45, label: "Hopes/Fears", labelPosition: "right" },
      { x: 85, y: 25, label: "Outcome", labelPosition: "right" },
    ],
    cardSize: {
      mobile: "w-12 aspect-[300/519]",
      desktop: "w-16 aspect-[300/519]",
    },
    icon: (isActive) => (
      <div className="flex gap-1 items-center">
        <div className="relative w-4 h-4">
          <div
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-3 rounded-[0.5px] ${
              isActive ? "bg-white/90" : "bg-white/30"
            }`}
          />
          <div
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-1 rounded-[0.5px] ${
              isActive ? "bg-white/90" : "bg-white/30"
            }`}
          />
        </div>
        <div className="flex flex-col gap-px">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-1 h-1 rounded-[0.5px] ${
                isActive ? "bg-white/90" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    ),
    interpretationInstruction: `
      Spread Type: Celtic Cross.
      1. Present: The heart of the matter.
      2. Challenge: What crosses you (obstacles).
      3. Foundation: Subconscious influences or past basis.
      4. Past: Recent past events.
      5. Crown: Conscious goals or best outcome.
      6. Future: Near future.
      7. Self: Your attitude/stance.
      8. Environment: External influences.
      9. Hopes/Fears: Psychological state.
      10. Outcome: Final result.
    `,
    defaultQuestions: [
      "我该如何解决目前面临的复杂局面？",
      "这件事的最终结果会是如何？",
      "我需要了解哪些被忽略的深层因素？",
    ],
  },

  RELATIONSHIP: {
    id: "RELATIONSHIP",
    name: "Relationship Mirror",
    description:
      "You · Them · Us. 深度解析双方心态、阻碍与关系走向。\n适合处于暧昧、冷战、或想要深入了解双方真实想法与关系潜力的时刻。",
    cardCount: 11,
    layoutType: "absolute",
    positions: [
      // Left Column (You) - Bottom to Top
      { x: 20, y: 80, label: "You Now", labelPosition: "bottom" },
      { x: 20, y: 60, label: "Your Weakness", labelPosition: "left" },
      { x: 20, y: 40, label: "Your Strength", labelPosition: "left" },
      { x: 20, y: 20, label: "Your View", labelPosition: "top" },

      // Right Column (Them) - Bottom to Top
      { x: 80, y: 80, label: "Them Now", labelPosition: "bottom" },
      { x: 80, y: 60, label: "Their Weakness", labelPosition: "right" },
      { x: 80, y: 40, label: "Their Strength", labelPosition: "right" },
      { x: 80, y: 20, label: "Their View", labelPosition: "top" },

      // Center Column (Relationship) - Bottom to Top
      { x: 50, y: 60, label: "Relationship Present", labelPosition: "bottom" },
      { x: 50, y: 40, label: "Near Future", labelPosition: "right" },
      { x: 50, y: 20, label: "Outcome", labelPosition: "top" },
    ],
    cardSize: {
      mobile: "w-14 aspect-[300/519]",
      desktop: "w-20 aspect-[300/519]",
    },
    icon: (isActive) => (
      <div className="flex gap-1 items-center h-5">
        <div className="flex flex-col gap-px">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-1 h-1 rounded-[0.5px] ${
                isActive ? "bg-white/90" : "bg-white/30"
              }`}
            />
          ))}
        </div>
        <div className="flex flex-col gap-px justify-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-1 h-1 rounded-[0.5px] ${
                isActive ? "bg-white/90" : "bg-white/30"
              }`}
            />
          ))}
        </div>
        <div className="flex flex-col gap-px">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-1 h-1 rounded-[0.5px] ${
                isActive ? "bg-white/90" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    ),
    interpretationInstruction: `
      Spread Type: Mister Tarot's Relationship Spread.
      This spread explores the underlying agendas, needs, and desires of two people in a relationship (or potential one).
      
      **Left Column (The Seeker / You):**
      1. **You Now:** Your current state, emotional condition, and readiness.
      2. **Your Weakness:** Distracting influences, personality issues, or blocks (e.g., criticism, neglect).
      3. **Your Strength:** Positive, nurturing qualities you bring (e.g., communication, respect).
      4. **Your View:** Your thoughts and feelings about the partnership.

      **Right Column (The Partner / Them):**
      5. **Them Now:** Their current state and readiness.
      6. **Their Weakness:** Their blocks or negative influences.
      7. **Their Strength:** Their positive contributions.
      8. **Their View:** Their thoughts and feelings about the partnership.

      **Center Column (The Relationship):**
      9. **Relationship Present:** The current stage/energy of the bond itself.
      10. **Near Future:** The next step or development in the relationship.
      11. **Outcome:** The likely result or energy of the partnership by the end of the timeframe.

      Compare parallel cards (e.g., Your View vs. Their View) to find alignment or conflict.
    `,
    defaultQuestions: [
      "我们这段关系的未来走向如何？",
      "对方目前对这段关系的真实想法是什么？",
      "我们需要克服哪些阻碍才能更进一步？",
      "我和他/她之间有发展的可能吗？",
    ],
  },
};
