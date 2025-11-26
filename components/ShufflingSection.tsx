import React, { useMemo } from "react";
import { motion } from "motion/react";
import TarotCard from "./TarotCard";
import { SpreadType, TarotCard as TarotCardType } from "../types";
import { SPREADS } from "../constants/spreads";
import { FULL_DECK, getDeckForPool } from "../constants/cards";

interface ShufflingSectionProps {
  cardCount: number;
  spread: SpreadType;
  isMobile: boolean;
}

const ShufflingSection: React.FC<ShufflingSectionProps> = ({
  cardCount,
  spread,
  isMobile,
}) => {
  const shuffleDeck = useMemo(() => {
    const spreadDef = SPREADS[spread];
    const pools =
      spreadDef.cardPools && spreadDef.cardPools.length > 0
        ? spreadDef.cardPools
        : ["FULL"];

    const deduped = new Map<number, TarotCardType>();
    pools.forEach((pool) => {
      getDeckForPool(pool).forEach((card) => {
        if (!deduped.has(card.id)) deduped.set(card.id, card);
      });
    });

    const base = deduped.size > 0 ? Array.from(deduped.values()) : FULL_DECK;
    const poolCopy = [...base];
    for (let i = poolCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [poolCopy[i], poolCopy[j]] = [poolCopy[j], poolCopy[i]];
    }

    const needed = Math.min(cardCount, poolCopy.length);
    const selected = poolCopy.slice(0, needed);

    // If cardCount exceeds pool, repeat random cards to fill animation slots
    while (selected.length < cardCount) {
      selected.push(base[Math.floor(Math.random() * base.length)]);
    }

    return selected;
  }, [cardCount, spread]);

  return (
    <motion.div
      key="shuffling"
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      {shuffleDeck.map((card, i) => {
        const offset = (i - shuffleDeck.length / 2) * (isMobile ? 8 : 14);
        const tilt = i % 2 === 0 ? 4 : -4;

        return (
          <motion.div
            key={card.id}
            layoutId={`card-${card.id}`}
            className="absolute origin-bottom"
            initial={{ y: 0, rotate: 0, scale: 1 }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, tilt, 0],
              x: [0, offset, 0],
              zIndex: [i, 20, i],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              delay: i * 0.18,
              ease: "easeInOut",
            }}
          >
            <TarotCard
              card={card}
              isRevealed={false}
              width={isMobile ? "w-36" : "w-48"}
              height="aspect-[300/519]"
              className="pointer-events-none drop-shadow-2xl"
            />
          </motion.div>
        );
      })}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.85 }}
        className="absolute bottom-16 text-center space-y-2 px-6"
      >
        <p className="text-xs mt-10  tracking-[0.3em] text-neutral-400 uppercase">
          {`洗牌中（稍后抽取 ${cardCount} 张牌）`}
        </p>
        <p className="text-[11px] text-neutral-500">
          保持呼吸，准备点击任意漂浮的卡牌。
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ShufflingSection;
