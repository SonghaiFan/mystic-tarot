import React from "react";
import { motion, AnimatePresence, HTMLMotionProps } from "motion/react";
import { TarotCard as TarotCardType, PickedCard } from "../types";
import { getCardImageUrl, getCardImageFallbackUrl } from "../constants";

interface TarotCardProps
  extends Omit<
    HTMLMotionProps<"div">,
    | "onAnimationStart"
    | "onDrag"
    | "onDragStart"
    | "onDragEnd"
    | "onDragOver"
    | "onLayoutAnimationStart"
    | "onLayoutAnimationComplete"
  > {
  card: TarotCardType | PickedCard;
  isRevealed?: boolean;
  isReversed?: boolean;
  isHorizontal?: boolean;
  isHovered?: boolean;
  onHover?: (id: number | null) => void;
  label?: string;
  labelPosition?: "top" | "bottom" | "left" | "right";
  width?: string;
  height?: string;
}

const TarotCard: React.FC<TarotCardProps> = ({
  card,
  isRevealed = false,
  isReversed: propIsReversed,
  isHorizontal = false,
  isHovered = false,
  onHover,
  label,
  labelPosition = "bottom",
  width = "w-28",
  height = "h-44",
  className = "",
  style,
  onClick,
  layoutId,
  ...motionProps
}) => {
  const isReversed =
    propIsReversed ??
    ("isReversed" in card ? (card as PickedCard).isReversed : false);

  const labelClasses = {
    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
    left: "right-full mr-2 top-1/2 -translate-y-1/2",
    right: "left-full ml-2 top-1/2 -translate-y-1/2",
  };

  return (
    <motion.div
      layoutId={layoutId || `card-${card.id}`}
      style={{
        transformStyle: "preserve-3d",
        rotate: isHorizontal ? 90 : 0,
        ...style,
      }}
      onClick={onClick}
      onMouseEnter={() => onHover?.(card.id)}
      onMouseLeave={() => onHover?.(null)}
      className={`relative cursor-pointer group ${width} ${height} ${className}`}
      {...motionProps}
    >
      {/* Card Container with Flip Animation */}
      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: "preserve-3d" }}
        initial={{
          rotateY: isRevealed ? 0 : 180,
          rotateZ: isReversed ? 180 : 0,
        }}
        animate={{
          rotateY: isRevealed ? 0 : 180,
          rotateZ: isReversed ? 180 : 0,
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* Front Face (Image) */}
        <div
          className="absolute inset-0 bg-black border border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.05)] overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img
            src={getCardImageUrl(card.image)}
            alt={card.nameEn}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== getCardImageFallbackUrl(card.image)) {
                target.src = getCardImageFallbackUrl(card.image);
              }
            }}
            className="w-full h-full object-cover"
            style={{
              filter: "grayscale(100%) contrast(1.2) brightness(0.9)",
              mixBlendMode: "normal",
            }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-black/40" />
          <div className="absolute inset-2 md:inset-3 border border-white/20 pointer-events-none" />
          <div
            className={`absolute bottom-0 w-full p-3 md:p-4 flex flex-col items-center text-center z-10 transition-opacity duration-500 ${
              isRevealed ? "opacity-100" : "opacity-0"
            }`}
          >
            <h2 className="text-[10px] md:text-sm text-white font-cinzel tracking-widest mb-1 drop-shadow-md">
              {card.nameEn}
            </h2>
            <p className="text-[9px] md:text-[10px] text-neutral-400 font-serif">
              {card.nameCn}
              {isReversed && (
                <span className="text-red-400/80 opacity-80 inline-block ml-1">
                  (逆位)
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Back Face (Pattern) */}
        <div
          className="absolute inset-0 bg-neutral-950 border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] flex items-center justify-center overflow-hidden group-hover:border-white/40 group-hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] transition-all duration-300"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "6px 6px",
            }}
          ></div>
          <div className="absolute inset-1 border-[0.5px] border-white/5" />
          <div className="w-3 h-3 border border-white/10 rotate-45 group-hover:rotate-90 transition-transform duration-700" />
        </div>
      </motion.div>

      {/* Label */}
      {label && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`absolute text-[8px] md:text-[9px] tracking-[0.2em] text-neutral-600 uppercase whitespace-nowrap pointer-events-none ${labelClasses[labelPosition]}`}
        >
          {label}
        </motion.div>
      )}
    </motion.div>
  );
};

export default TarotCard;
