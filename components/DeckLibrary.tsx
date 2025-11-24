import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, BookOpen } from "lucide-react";
import { MAJOR_ARCANA, MINOR_ARCANA } from "../constants/cards";
import { TarotCard as TarotCardType } from "../types";
import TarotCard from "./TarotCard";

interface DeckLibraryProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeckLibrary: React.FC<DeckLibraryProps> = ({ isOpen, onClose }) => {
  const [selectedCard, setSelectedCard] = useState<TarotCardType | null>(null);
  const [activeTab, setActiveTab] = useState<
    "major" | "wands" | "cups" | "swords" | "pentacles"
  >("major");

  // Helper to filter minor arcana by suit
  const getSuitCards = (suit: string) => {
    return MINOR_ARCANA.filter((card) =>
      card.nameEn.toLowerCase().includes(suit)
    );
  };

  const wands = getSuitCards("wands");
  const cups = getSuitCards("cups");
  const swords = getSuitCards("swords");
  const pentacles = getSuitCards("pentacles");

  const renderGrid = (cards: TarotCardType[]) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-8 p-4 md:p-8 pb-32">
      {cards.map((card) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-3 group cursor-pointer"
          onClick={() => setSelectedCard(card)}
        >
          <div className="relative w-full aspect-300/519">
            <TarotCard
              card={card}
              isRevealed={true}
              isReversed={false}
              width="w-full"
              height="h-full"
              className="shadow-lg"
            />
          </div>
        </motion.div>
      ))}
    </div>
  );

  const tabs = [
    { id: "major", label: "MAJOR ARCANA", cards: MAJOR_ARCANA },
    { id: "wands", label: "WANDS", cards: wands },
    { id: "cups", label: "CUPS", cards: cups },
    { id: "swords", label: "SWORDS", cards: swords },
    { id: "pentacles", label: "PENTACLES", cards: pentacles },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black flex flex-col"
        >
          {/* Tabs */}
          <div className="border-b border-white/5 bg-black/30 pt-16 md:pt-20">
            <div className="flex flex-wrap justify-center px-2 md:px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative px-3 md:px-6 py-3 md:py-4 text-[10px] md:text-xs tracking-[0.2em] transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "text-white"
                      : "text-neutral-600 hover:text-neutral-400"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/50"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-neutral-900/20 to-black">
            {renderGrid(tabs.find((t) => t.id === activeTab)?.cards || [])}
          </div>

          {/* Detailed View Overlay */}
          {createPortal(
            <AnimatePresence>
              {selectedCard && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-8"
                  style={{ zIndex: 9999 }}
                  onClick={() => setSelectedCard(null)}
                >
                  <TarotCard
                    card={selectedCard}
                    isRevealed={true}
                    isDetailed={true}
                    width="w-full max-w-md md:max-w-4xl"
                    height="h-[80vh] md:h-[85vh]"
                    className="shadow-2xl cursor-default"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    onClick={() => setSelectedCard(null)}
                    className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors z-50"
                  >
                    <X size={32} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>,
            document.body
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeckLibrary;
