import { Sparkles, Library, ArrowLeft } from "lucide-react";
import AudioVisualizer from "./AudioVisualizer";
import { GameState } from "../types";

interface HeaderBarProps {
  gameState: GameState;
  isAudioPlaying: boolean;
  onLibraryClick: () => void;
  onHomeClick: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({
  gameState,
  isAudioPlaying,
  onLibraryClick,
  onHomeClick,
}) => {
  const getStateLabel = () => {
    switch (gameState) {
      case GameState.LIBRARY:
        return "Library";
      case GameState.INPUT:
        return "Question";
      case GameState.SHUFFLING:
        return "Shuffling";
      case GameState.PICKING:
        return "Selection";
      case GameState.REVEAL:
      case GameState.READING:
        return "Reading";
      case GameState.INTRO:
        return "";
      default:
        return "";
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-24 px-6 md:px-8 flex justify-between items-center z-40 pointer-events-none bg-linear-to-b from-black/80 to-transparent">
      {/* Left: Logo / Home */}
      <div className="flex items-center gap-6 pointer-events-auto">
        <button onClick={onHomeClick} className="flex flex-col gap-1 group">
          <div className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors">
            <Sparkles size={14} />
            <h1 className="text-xs font-cinzel tracking-[0.4em] font-bold">
              MYSTIC
            </h1>
          </div>
          <div className="w-full h-px bg-white/10 group-hover:bg-white/30 transition-colors" />
        </button>

        {/* State Breadcrumb */}
        {gameState !== GameState.INTRO && (
          <div className="hidden md:flex items-center gap-2 text-neutral-500 text-[10px] tracking-widest uppercase animate-in fade-in slide-in-from-left-4">
            <span className="w-px h-4 bg-white/10" />
            <span>{getStateLabel()}</span>
          </div>
        )}
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-6 pointer-events-auto">
        <button
          onClick={onLibraryClick}
          className={`text-white/50 hover:text-white transition-colors flex items-center gap-2 ${
            gameState === GameState.LIBRARY ? "text-white" : ""
          }`}
          title={
            gameState === GameState.LIBRARY ? "Close Library" : "Open Library"
          }
        >
          {gameState === GameState.LIBRARY ? (
            <ArrowLeft size={16} />
          ) : (
            <Library size={16} />
          )}
          <span className="text-[10px] uppercase tracking-widest hidden md:inline">
            {gameState === GameState.LIBRARY ? "Back" : "Library"}
          </span>
        </button>

        <div className="w-px h-4 bg-white/10 hidden md:block" />

        <AudioVisualizer isPlaying={isAudioPlaying} />
      </div>
    </header>
  );
};

export default HeaderBar;
