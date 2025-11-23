import React from "react";
import { Clover, Sparkles } from "lucide-react";
import AudioVisualizer from "./AudioVisualizer";

interface HeaderBarProps {
  isAudioPlaying: boolean;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ isAudioPlaying }) => (
  <header className="absolute top-0 h-20 w-full p-6 md:p-8 flex justify-between items-end z-40 pointer-events-none">
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 text-white/80">
        <Sparkles size={14} />
      </div>
      <div className="w-full h-px bg-white/10" />
    </div>
    <AudioVisualizer isPlaying={isAudioPlaying} />
  </header>
);

export default HeaderBar;
