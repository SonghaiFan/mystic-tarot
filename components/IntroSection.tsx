import React from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { SILKY_EASE } from "../constants/ui";
import ASCIIText from "../utils/ASCIIText";

interface IntroSectionProps {
  onEnter: () => void;
}

const IntroSection: React.FC<IntroSectionProps> = ({ onEnter }) => (
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
        className="relative text-7xl md:text-9xl font-thin tracking-tighter text-white mix-blend-difference opacity-90"
      >
        <span className="opacity-0">命运塔罗</span>
        <div className="absolute inset-0">
          <ASCIIText text="命运塔罗" enableWaves={true} asciiFontSize={4} />
        </div>
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
    </div>
  </motion.div>
);

export default IntroSection;
