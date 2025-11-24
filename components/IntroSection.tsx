import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, BookOpen } from "lucide-react";
import { SILKY_EASE } from "../constants/ui";
import DeckLibrary from "./DeckLibrary";

interface IntroSectionProps {
  onEnter: () => void;
  isLibraryOpen: boolean;
  onLibraryToggle: (isOpen: boolean) => void;
}

const IntroSection: React.FC<IntroSectionProps> = ({
  onEnter,
  isLibraryOpen,
  onLibraryToggle,
}) => {
  return (
    <>
      <motion.div
        key="intro"
        className="h-screen w-full flex flex-col items-center justify-center text-center space-y-12 z-20"
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
            className="text-7xl md:text-9xl font-cinzel tracking-tighter text-white mix-blend-difference opacity-90"
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
            onClick={onEnter}
            className="group relative px-10 py-4 border border-white/10 hover:border-white/40 transition-all duration-700 bg-black/50 backdrop-blur-md"
          >
            <span className="relative z-10 flex items-center gap-4 text-xs tracking-[0.3em] text-neutral-400 group-hover:text-white transition-colors">
              ENTER THE VOID <ArrowRight size={12} />
            </span>
            <div className="absolute inset-0 bg-white/5 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left ease-out" />
          </motion.button>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 1 }}
            onClick={() => onLibraryToggle(true)}
            className="group relative px-8 py-3 border border-transparent hover:border-white/10 transition-all duration-700"
          >
            <span className="relative z-10 flex items-center gap-3 text-[10px] tracking-[0.2em] text-neutral-600 group-hover:text-white/80 transition-colors">
              <BookOpen size={12} /> DECK LIBRARY
            </span>
          </motion.button>
        </div>
      </motion.div>

      <DeckLibrary
        isOpen={isLibraryOpen}
        onClose={() => onLibraryToggle(false)}
      />
    </>
  );
};

export default IntroSection;
