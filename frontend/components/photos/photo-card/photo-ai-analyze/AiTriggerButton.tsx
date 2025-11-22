import React from 'react';

interface IAiTriggerButton {
  onClick: (e: React.MouseEvent) => void;
}

export default function AiTriggerButton({ onClick }: IAiTriggerButton) {
  return (
    <button
      onClick={onClick}
      className="absolute top-3 right-3 z-30 flex items-center gap-1 px-3 py-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-medium rounded-full border border-white/20 transition-all shadow-lg opacity-100 lg:opacity-0 lg:group-hover:opacity-100 translate-y-0 lg:group-hover:translate-y-0 duration-300 cursor-pointer"
    >
      ✨ AI Analiz
    </button>
  );
}
