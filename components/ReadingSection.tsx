import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Download, RefreshCw, Volume2 } from "lucide-react";
import { SpreadType, PickedCard } from "../types";
import { SILKY_EASE } from "../constants/ui";
import { SPREADS } from "../constants/spreads";
import TarotCard from "./TarotCard";
import CardTooltip from "./CardTooltip";

interface ReadingSectionProps {
  spread: SpreadType;
  isMobile: boolean;
  pickedCards: PickedCard[];
  revealedCardIds: Set<number>;
  onCardReveal: (id: number) => void;
  hoveredCardId: number | null;
  onCardHover: (id: number | null) => void;
  isThinking: boolean;
  thinkingKeywordIndex: number;
  question: string;
  readingText: string;
  readingAudioBuffer: AudioBuffer | null;
  isAudioPlaying: boolean;
  onReplayAudio: () => void;
  onDownload: () => void;
  onReset: () => void;
}

const ReadingSection: React.FC<ReadingSectionProps> = ({
  spread,
  isMobile,
  pickedCards,
  revealedCardIds,
  onCardReveal,
  hoveredCardId,
  onCardHover,
  isThinking,
  thinkingKeywordIndex,
  question,
  readingText,
  readingAudioBuffer,
  isAudioPlaying,
  onReplayAudio,
  onDownload,
  onReset,
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleCardClick = (id: number) => {
    if (!revealedCardIds.has(id)) {
      onCardReveal(id);
    }
  };

  const allCardsRevealed = revealedCardIds.size === pickedCards.length;

  const renderThinkingPhrase = () => {
    const allKeywords = pickedCards.flatMap((c) => c.keywords);
    const phrases = [
      "Consulting the Stars...",
      "Weaving the Threads of Fate...",
      "Listening to the Whispers...",
      "Aligning with the Cosmos...",
      ...allKeywords,
    ];
    return phrases[thinkingKeywordIndex % phrases.length];
  };

  return (
    <motion.div
      key="reading-layout"
      className="flex flex-col items-center w-full max-w-6xl gap-16"
      layout
    >
      <div
        className={`mt-10 ${
          SPREADS[spread].layoutType === "absolute" && !isMobile
            ? "relative w-full h-[80vh] max-w-4xl mx-auto"
            : `flex flex-wrap justify-center gap-4 md:gap-8 ${
                spread === "THREE" ? "items-start" : "items-center"
              }`
        }`}
      >
        <AnimatePresence>
          {pickedCards
            .slice(0, SPREADS[spread].cardCount)
            .map((card, index) => {
              const isHovered = hoveredCardId === card.id;
              const spreadConfig = SPREADS[spread];
              const position = spreadConfig.positions?.[index];

              const absoluteStyle =
                spreadConfig.layoutType === "absolute" && !isMobile && position
                  ? {
                      position: "absolute" as const,
                      left: `${position.x}%`,
                      top: `${position.y}%`,
                      marginLeft: "-3.5rem", // Half of w-28 (7rem)
                      marginTop: "-5.5rem", // Half of h-44 (11rem)
                      zIndex: isHovered ? 100 : position.zIndex || 5,
                      rotate: position.rotation || 0,
                    }
                  : undefined;

              const label =
                spreadConfig.layoutType === "absolute"
                  ? position?.label
                  : spreadConfig.labels?.[index];

              const labelPosition = position?.labelPosition || "bottom";

              return (
                <TarotCard
                  key={card.id}
                  layoutId={`card-${card.id}`}
                  card={card}
                  isRevealed={revealedCardIds.has(card.id)}
                  isHovered={isHovered}
                  isHorizontal={!!position?.rotation && !isMobile}
                  onHover={onCardHover}
                  onClick={() => handleCardClick(card.id)}
                  style={absoluteStyle}
                  label={label}
                  labelPosition={labelPosition}
                  className={
                    isMobile
                      ? spreadConfig.cardSize.mobile
                      : spreadConfig.cardSize.desktop
                  }
                  animate={{
                    scale: isHovered ? 1.1 : 1,
                    zIndex: isHovered ? 100 : absoluteStyle?.zIndex || "auto",
                  }}
                />
              );
            })}
        </AnimatePresence>
      </div>

      {/* Tooltip Portal */}
      {createPortal(
        <AnimatePresence>
          {hoveredCardId !== null && (
            <CardTooltip
              card={pickedCards.find((c) => c.id === hoveredCardId)!}
              x={mousePos.x + 15}
              y={mousePos.y + 15}
              isRevealed={revealedCardIds.has(hoveredCardId)}
            />
          )}
        </AnimatePresence>,
        document.body
      )}

      <div className="w-full max-w-4xl min-h-[150px] flex flex-col items-center justify-center text-center pb-12">
        <AnimatePresence mode="wait">
          {!allCardsRevealed ? (
            <motion.div
              key="reveal-prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-neutral-500 text-sm tracking-widest uppercase"
            >
              Reveal all cards to see the interpretation
            </motion.div>
          ) : isThinking ? (
            <motion.div
              key="thinking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-8 items-center w-full max-w-xl px-4"
            >
              <div className="h-8 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={thinkingKeywordIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="text-xs tracking-[0.3em] text-neutral-400 uppercase"
                  >
                    {renderThinkingPhrase()}
                  </motion.span>
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-2">
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
          ) : (
            <motion.div
              id="reading-content"
              key="text-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: SILKY_EASE }}
              className="relative px-4 md:px-0"
            >
              {question && (
                <p className="text-xs text-neutral-600 mb-4 tracking-widest uppercase">
                  Reflecting on: "{question}"
                </p>
              )}
              <div className="w-12 h-px bg-white/20 mx-auto mb-6" />
              <p className="text-base md:text-xl leading-loose text-neutral-300 font-light font-serif tracking-wide mb-12 max-w-xl mx-auto text-justify md:text-center">
                {readingText.split("**").map((part, idx) =>
                  idx % 2 === 1 ? (
                    <strong key={idx} className="font-bold text-white/90">
                      {part}
                    </strong>
                  ) : (
                    part
                  )
                )}
              </p>

              <div className="flex items-center justify-center gap-4 mb-8">
                {readingAudioBuffer && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    onClick={onReplayAudio}
                    disabled={isAudioPlaying}
                    className="inline-flex items-center gap-2 text-xs tracking-[0.2em] text-neutral-600 hover:text-white transition-colors group px-4 py-2 border border-neutral-800 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="重播解读音频"
                  >
                    <Volume2
                      size={14}
                      className={isAudioPlaying ? "animate-pulse" : ""}
                    />
                    REPLAY
                  </motion.button>
                )}

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.2 }}
                  onClick={onDownload}
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
                transition={{ delay: 3 }}
                onClick={onReset}
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
  );
};

export default ReadingSection;
