import React from 'react';
import ReactMarkdown from 'react-markdown';

interface AiResultOverlayProps {
  data: any;
  onClose: (e: React.MouseEvent) => void;
  onReset: (e: React.MouseEvent) => void;
  stopEvent: (e: React.MouseEvent) => void;
}

export default function AiResultOverlay({ data, onClose, onReset, stopEvent }: AiResultOverlayProps) {
  const cleanMarkdown = (text: string) => {
    if (!text) return '';
    return text.replace(/```markdown|```/g, '').trim();
  };

  return (
    <div
      onClick={stopEvent}
      className="absolute inset-0 z-40 bg-[#f5f1ea] flex flex-col animate-in slide-in-from-bottom-5 duration-300 overflow-hidden"
    >
      <div className="flex justify-between items-center p-4 border-b border-white/10 bg-gray-50 shadow-sm shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-lg">✨</span>
          <h3 className="font-bold text-sm text-[#ef7464]">Analiz Sonucu</h3>
        </div>
        <button
          onClick={onClose}
          className="text-white text-xs bg-[#ef7464] hover:bg-[#ef7464da] px-2 py-1 rounded transition-colors cursor-pointer"
        >
          Kapat
        </button>
      </div>

      <div className="p-5 overflow-y-auto custom-scrollbar flex-1 text-sm text-black font-light leading-relaxed tracking-wide">
        <ReactMarkdown
          components={{
            h1: (props) => <h3 className="text-lg font-bold mt-4 mb-2 text-[#ef7464]" {...props} />,
            h2: (props) => <h3 className="text-base font-bold mt-4 mb-2 text-[#ef7464]" {...props} />,
            h3: (props) => <h3 className="text-sm font-bold mt-4 mb-2 text-[#ef7464] uppercase" {...props} />,
            strong: (props) => <span className="font-bold text-[#ef7464]" {...props} />,
            ul: (props) => <ul className="list-disc pl-5 space-y-1 my-2 text-gray-800" {...props} />,
            ol: (props) => <ol className="list-decimal pl-5 space-y-1 my-2 text-gray-800" {...props} />,
            li: (props) => <li className="pl-1 marker:text-[#ef7464]" {...props} />,
            p: (props) => <p className="mb-3 last:mb-0" {...props} />,
          }}
        >
          {cleanMarkdown(data.data.analysis)}
        </ReactMarkdown>

        {data.data.remaining_credits !== undefined && (
          <div className="mt-6 text-[10px] text-gray-500 text-center border-t border-gray-200 pt-2">
            Bugün kalan hakkınız: <span className="font-bold text-[#ef7464]">{data.data.remaining_credits}</span>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/10 shadow-sm bg-gray-50 shrink-0">
        <button
          onClick={onReset}
          className="w-full py-2 bg-[#ef7464] hover:bg-[#ef7464b6] text-white text-xs font-medium rounded-lg transition-colors flex justify-center items-center gap-2 cursor-pointer"
        >
          ← Yeni Soru Sor
        </button>
      </div>
    </div>
  );
}
