import React from "react";
import { Sparkles, X, Home, ChevronRight } from "lucide-react";
import AudioVisualizer from "./AudioVisualizer";
import { GameState } from "../types";

interface HeaderBarProps {
  isAudioPlaying: boolean;
  gameState: GameState;
  isLibraryOpen: boolean;
  onCloseLibrary: () => void;
  onNavigateHome: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({
  isAudioPlaying,
  gameState,
  isLibraryOpen,
  onCloseLibrary,
  onNavigateHome,
}) => {
  const getPhaseLabel = () => {
    if (isLibraryOpen) return "ARCANA LIBRARY";
    switch (gameState) {
      case GameState.INTRO:
        return "THE VOID";
      case GameState.INPUT:
        return "THE QUESTION";
      case GameState.SHUFFLING:
        return "THE SHUFFLE";
      case GameState.PICKING:
        return "THE SELECTION";
      case GameState.REVEAL:
        return "THE REVELATION";
      case GameState.READING:
        return "THE INTERPRETATION";
      default:
        return "MYSTIC TAROT";
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[60] pointer-events-none">
      {/* Top Border Line with Star */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/50">
          <Sparkles size={10} />
        </div>
      </div>

      <div className="flex items-center justify-between px-4 md:px-6 h-16 md:h-20 bg-gradient-to-b from-black/90 to-transparent backdrop-blur-[2px]">
        {/* Left: Brand / Home */}
        <div className="flex items-center gap-4 pointer-events-auto">
          <button
            onClick={onNavigateHome}
            className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <Sparkles size={16} className="text-white/80" />
            <span className="text-[10px] md:text-xs font-cinzel tracking-[0.2em] font-bold block">
              MYSTIC
            </span>
          </button>

          {/* Breadcrumb Separator */}
          <div className="h-px w-8 bg-white/20 hidden md:block" />

          {/* Current State Label */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] md:text-xs font-cinzel tracking-[0.2em] text-white/80">
              {getPhaseLabel()}
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-6 pointer-events-auto h-full">
          <div className="h-8 flex items-center">
            <AudioVisualizer isPlaying={isAudioPlaying} />
          </div>

          {isLibraryOpen && (
            <button
              onClick={onCloseLibrary}
              className="p-2 -mr-2 text-neutral-500 hover:text-white transition-colors rounded-full hover:bg-white/5"
            >
              <X size={20} />
            </button>
          )}

          {!isLibraryOpen && gameState !== GameState.INTRO && (
            <button
              onClick={onNavigateHome}
              className="p-2 -mr-2 text-neutral-500 hover:text-white transition-colors rounded-full hover:bg-white/5"
              title="Return to Void"
            >
              <Home size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Bottom Decorative Line */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </header>
  );
};

export default HeaderBar;
