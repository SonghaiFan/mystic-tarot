import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";
import { SpreadType } from "../types";
import { SILKY_EASE } from "../constants/ui";
import { SPREADS } from "../constants/spreads";

interface InputSectionProps {
  question: string;
  spread: SpreadType | null;
  onQuestionChange: (value: string) => void;
  onSpreadChange: (spread: SpreadType) => void;
  onStartRitual: () => void;
}

const InputSection: React.FC<InputSectionProps> = ({
  question,
  spread,
  onQuestionChange,
  onSpreadChange,
  onStartRitual,
}) => {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setPlaceholderIndex(0);
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [spread]);

  const getPlaceholder = () => {
    if (!spread) return "在此输入你心中的疑惑...";
    const questions = SPREADS[spread].defaultQuestions;
    if (!questions || questions.length === 0) return "在此输入你心中的疑惑...";
    return questions[placeholderIndex % questions.length];
  };

  return (
    <motion.div
      key="input"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.8 } }}
      transition={{ duration: 1, ease: SILKY_EASE }}
      className="w-full max-w-3xl flex flex-col gap-16 items-center mt-10"
    >
      {/* Guidance Text */}
      <div className="text-center space-y-4">
        <p className="text-base md:text-lg text-neutral-300 font-serif tracking-wide">
          请闭上双眼，深呼吸三次
        </p>
        <p className="text-xs md:text-sm text-neutral-500 tracking-[0.2em]">
          在心中默念你的困惑，保持虔诚与专注
        </p>
      </div>
      {/* Question Input */}
      <div className="w-full relative group">
        <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000 blur-2xl -z-10 rounded-full" />
        <label className="text-[10px] tracking-[0.4em] text-neutral-600 uppercase block text-center mb-8 group-hover:text-neutral-400 transition-colors">
          What is your query?
        </label>
        <div className="relative w-full">
          <AnimatePresence mode="wait">
            {!question && !isFocused && (
              <motion.div
                key={getPlaceholder()}
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <span className="text-2xl md:text-4xl lg:text-5xl text-white/10 font-serif tracking-wide text-center px-4 whitespace-nowrap">
                  {getPlaceholder()}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          <input
            type="text"
            name="tarot-query"
            autoComplete="off"
            data-lpignore="true"
            value={question}
            onChange={(e) => onQuestionChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-transparent border-b border-white/10 py-6 md:py-8 text-center text-2xl md:text-4xl lg:text-5xl text-white focus:outline-none focus:border-white/40 transition-all duration-700 font-serif tracking-wide relative z-10"
          />
        </div>
      </div>{" "}
      {/* Spread Selection */}
      <div className="w-full space-y-6">
        <label className="text-[10px] tracking-[0.3em] text-neutral-500 uppercase block text-center">
          Choose your spread
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.values(SPREADS).map((s) => (
            <button
              key={s.id}
              onClick={() => onSpreadChange(s.id)}
              className={`relative p-4 border transition-all duration-500 flex flex-col items-center gap-4 group ${
                spread === s.id
                  ? "border-white/60 bg-white/5"
                  : "border-white/10 hover:border-white/30"
              }`}
            >
              <div className="flex gap-1 items-center justify-center h-8 w-8 relative">
                {s.icon(spread === s.id)}
              </div>
              <span
                className={`text-[10px] tracking-widest uppercase transition-colors ${
                  spread === s.id ? "text-white" : "text-white/40"
                }`}
              >
                {s.id}
              </span>

              {/* Selection Indicator */}
              <AnimatePresence>
                {spread === s.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-2 right-2 text-white/60"
                  >
                    <Check size={12} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>
        <div className="h-8 text-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={spread || "none"}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-xs text-white/40 font-light tracking-wide"
            >
              {spread
                ? SPREADS[spread].description
                : "Select a spread to begin"}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
      <motion.button
        onClick={onStartRitual}
        disabled={!spread}
        whileHover={spread ? { scale: 1.05 } : {}}
        whileTap={spread ? { scale: 0.95 } : {}}
        className={`mt-8 px-8 py-3 border text-xs tracking-[0.3em] transition-all ${
          spread
            ? "bg-white/5 hover:bg-white/10 border-white/20 text-white cursor-pointer"
            : "bg-transparent border-white/5 text-white/20 cursor-not-allowed"
        }`}
      >
        BEGIN RITUAL
      </motion.button>
    </motion.div>
  );
};

export default InputSection;
