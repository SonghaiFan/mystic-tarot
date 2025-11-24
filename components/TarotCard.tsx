import React from "react";
import { motion, AnimatePresence, HTMLMotionProps } from "motion/react";
import { TarotCard as TarotCardType, PickedCard } from "../types";
import { getCardImageUrl, getCardImageFallbackUrl } from "../constants/cards";

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
  isDetailed?: boolean;
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
  isDetailed = false,
  onHover,
  label,
  labelPosition = "bottom",
  width = "w-28",
  height = "aspect-[300/519]",
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
      onMouseEnter={() => !isDetailed && onHover?.(card.id)}
      onMouseLeave={() => !isDetailed && onHover?.(null)}
      className={`relative ${
        !isDetailed ? "cursor-pointer group" : ""
      } ${width} ${height} ${className}`}
      {...motionProps}
    >
      {/* Card Container with Flip Animation */}
      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: "preserve-3d" }}
        initial={{
          rotateY: isRevealed ? 0 : 180,
          rotateZ: isReversed && !isDetailed ? 180 : 0,
        }}
        animate={{
          rotateY: isRevealed ? 0 : 180,
          rotateZ: isReversed && !isDetailed ? 180 : 0,
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* Front Face (Image) */}
        <div
          className={`absolute inset-0 bg-black border border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.05)] overflow-hidden ${
            isDetailed ? "md:flex md:flex-row" : ""
          }`}
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Image Container */}
          <div
            className={`relative w-full h-full ${
              isDetailed ? "md:w-1/2 md:border-r md:border-white/10" : ""
            }`}
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
            {/* Gradient Overlay - Only show on mobile if detailed, or always if not detailed */}
            <div
              className={`absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-black/40 ${
                isDetailed ? "md:hidden" : ""
              }`}
            />
            {/* Border - Hide in detailed desktop view as it conflicts with layout */}
            <div
              className={`absolute inset-2 md:inset-3 border border-white/20 pointer-events-none ${
                isDetailed ? "md:hidden" : ""
              }`}
            />
          </div>

          {/* Content Container */}
          <div
            className={`
              flex flex-col items-center text-center z-10 transition-opacity duration-500
              ${isRevealed ? "opacity-100" : "opacity-0"}
              ${
                isDetailed
                  ? "absolute bottom-0 w-full bg-linear-to-t from-black via-black/95 to-transparent pt-24 pb-10 px-6 md:static md:w-1/2 md:h-full md:bg-neutral-950 md:pt-16 md:px-16 md:justify-center md:overflow-y-auto md:border-l md:border-white/5"
                  : "absolute bottom-0 w-full p-3 md:p-4"
              }
            `}
          >
            {/* Decorative Element for Desktop Detailed View */}
            {isDetailed && (
              <div className="hidden md:block absolute top-8 left-8 right-8 bottom-8 border border-white/5 pointer-events-none" />
            )}

            <h2
              className={`${
                isDetailed
                  ? "text-3xl md:text-5xl mb-3 text-amber-50/90"
                  : "text-[10px] md:text-sm mb-1 text-white"
              } font-cinzel tracking-widest drop-shadow-md`}
            >
              {card.nameEn}
            </h2>
            <p
              className={`${
                isDetailed
                  ? "text-sm md:text-lg mb-8 tracking-wide"
                  : "text-[9px] md:text-[10px]"
              } text-neutral-400 font-serif`}
            >
              {card.nameCn}
              {isReversed && (
                <span className="text-red-400/80 opacity-80 inline-block ml-2 font-light italic">
                  (Reversed)
                </span>
              )}
            </p>

            {isDetailed && "keywords" in card && (
              <div className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 relative z-10">
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                  {(card as PickedCard).keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="text-[10px] md:text-xs px-3 py-1 bg-white/5 border border-white/10 rounded-sm text-neutral-300 tracking-[0.15em] uppercase hover:bg-white/10 transition-colors"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-4 mb-8 opacity-30">
                  <div className="h-px w-12 bg-white" />
                  <div className="w-1.5 h-1.5 rotate-45 border border-white" />
                  <div className="h-px w-12 bg-white" />
                </div>

                <p className="text-sm md:text-base text-neutral-300 font-light leading-loose text-justify tracking-wide">
                  {isReversed
                    ? (card as PickedCard).negative
                    : (card as PickedCard).positive}
                </p>
                {(card as PickedCard).description && (
                  <div className="mt-8 pt-8 border-t border-white/5">
                    <h4 className="text-[10px] text-neutral-500 uppercase tracking-[0.3em] mb-4 text-center">
                      Arcana Wisdom
                    </h4>
                    <p className="text-xs md:text-sm text-neutral-400 font-light leading-relaxed text-justify opacity-80">
                      {(card as PickedCard).description}
                    </p>
                  </div>
                )}
              </div>
            )}
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
