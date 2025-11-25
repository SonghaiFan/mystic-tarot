import React from "react";
import { motion } from "motion/react";

const ShufflingSection: React.FC = () => (
  <motion.div
    key="shuffling"
    className="absolute inset-0 flex items-center justify-center pointer-events-none"
    exit={{ opacity: 0, transition: { duration: 0.5 } }}
  >
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="absolute w-48 h-80 md:w-64 md:h-96 rounded-sm shadow-2xl origin-bottom overflow-hidden"
        initial={{ y: 0, rotate: 0, scale: 1 }}
        animate={{
          y: [0, -40, 0],
          rotate: [0, i === 1 ? 5 : i === 2 ? -5 : 0, 0],
          x: [0, i === 1 ? 40 : i === 2 ? -40 : 0, 0],
          zIndex: [i, 10, i],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: i * 0.2,
          ease: "easeInOut",
        }}
      >
        <div className="absolute inset-0 bg-neutral-950 border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "6px 6px",
            }}
          ></div>
          <div className="absolute inset-1 border-[0.5px] border-white/5" />
          <div className="w-3 h-3 border border-white/10 rotate-45" />
        </div>
      </motion.div>
    ))}
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.6 }}
      className="absolute bottom-24 text-xs tracking-[0.5em] text-neutral-500 animate-pulse"
    >
      CONCENTRATING...
    </motion.p>
  </motion.div>
);

export default ShufflingSection;
