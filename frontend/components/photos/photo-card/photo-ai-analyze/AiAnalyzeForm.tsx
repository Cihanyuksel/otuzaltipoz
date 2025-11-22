import React from 'react';
import Button from '@/common/button';
import { PROMPT_CATEGORIES } from './prompt';

interface IAiAnalysisFormP {
  prompt: string;
  isPending: boolean;
  error: Error | null;
  validationError: string;
  onPromptChange: (val: string) => void;
  onAnalyze: (e: React.MouseEvent) => void;
  stopEvent: (e: React.MouseEvent | React.ChangeEvent) => void;
}

export default function AiAnalysisForm({
  prompt,
  isPending,
  error,
  validationError,
  onPromptChange,
  onAnalyze,
  stopEvent,
}: IAiAnalysisFormP) {
  const handleLinkClick = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pb-2">
        <div className="flex flex-col gap-3">
          <div className="relative">
            <select
              onChange={(e) => {
                stopEvent(e);
                onPromptChange(e.target.value);
              }}
              onClick={stopEvent}
              defaultValue=""
              className="w-full p-2 text-xs bg-black/40 border border-gray-600 rounded-lg focus:border-[#ef7464] focus:ring-1 focus:ring-[#ef7464] outline-none text-gray-300 appearance-none cursor-pointer hover:bg-black/60 transition-colors"
            >
              <option value="" disabled>
                Hızlı bir soru seç...
              </option>
              {Object.entries(PROMPT_CATEGORIES).map(([category, questions]) => (
                <optgroup key={category} label={category} className="bg-slate-800 text-gray-300">
                  {questions.map((q, i) => (
                    <option key={i} value={q} className="text-white">
                      {q}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-[10px]">
              ▼
            </div>
          </div>

          <div className="relative">
            <textarea
              className="w-full p-3 text-xs bg-black/40 border border-gray-600 rounded-lg focus:border-[#ef7464] focus:ring-1 focus:ring-[#ef7464] outline-none text-gray-300 resize-none transition-all"
              rows={3}
              maxLength={250}
              value={prompt}
              onClick={stopEvent}
              onChange={(e) => {
                stopEvent(e);
                onPromptChange(e.target.value);
              }}
              placeholder="Veya kendi sorunuzu buraya yazın..."
            />
            <div className="absolute bottom-2 right-2 text-[10px] text-gray-500 pointer-events-none">
              {prompt.length}/250
            </div>
          </div>
        </div>

        <Button
          onClick={onAnalyze}
          disabled={isPending}
          className="w-full py-2.5 text-white text-xs font-semibold rounded-lg disabled:opacity-50 transition-all shadow-lg shadow-[#ef7464] flex justify-center items-center gap-2"
        >
          {isPending ? (
            <>
              <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analiz Ediliyor...
            </>
          ) : (
            'Yorumla'
          )}
        </Button>

        {(error || validationError) && (
          <div className="text-xs text-red-300 bg-red-900/30 p-2 rounded border border-red-800">
            {validationError || error?.message}
          </div>
        )}

        <div className="pt-4 mt-2 border-t border-white/10 text-[10px] text-gray-100 leading-tight space-y-2">
          <p className="flex items-center gap-1">
            <span className="text-[#ef7464]">●</span> Günlük Limit: <strong>20 Analiz</strong> / Kullanıcı.
          </p>
          <p className="opacity-70">
            Bu hizmet Google Gemini AI altyapısını kullanır. Görselleriniz analiz amacıyla Google sunucularında işlenir.
            Lütfen hassas kişisel veriler içeren fotoğrafları paylaşmayınız.
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-300 ml-1"
              onClick={handleLinkClick}
            >
              Gizlilik Politikası
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
