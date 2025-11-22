import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useAnalyzePhoto } from '@/hooks/api/usePhotoApi';
import AiTriggerButton from './AiTriggerButton';
import Login from './Login';
import AiAnalysisForm from './AiAnalyzeForm';
import AiResultOverlay from './AiResultOverlay';

interface IPhotoAIAnalyzer {
  photoUrl: string;
}

export default function PhotoAIAnalyzer({ photoUrl }: IPhotoAIAnalyzer) {
  const { user } = useAuth();
  const router = useRouter();

  // States
  const [prompt, setPrompt] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [validationError, setValidationError] = useState('');

  // API Hook
  const { mutate, isPending, data, error, reset } = useAnalyzePhoto();

  // Helpers
  const stopEvent = (e: React.MouseEvent | React.ChangeEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (e.nativeEvent) {
      e.nativeEvent.stopImmediatePropagation();
    }
  };

  // Handlers
  const handleAnalyze = (e: React.MouseEvent) => {
    stopEvent(e);
    setValidationError('');

    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) {
      setValidationError('Lütfen analiz için bir soru yazın veya listeden seçin.');
      return;
    }

    if (trimmedPrompt.length > 250) {
      setValidationError('Soru en fazla 250 karakter olabilir.');
      return;
    }

    const structuredPrompt = `${trimmedPrompt} \n\nLütfen cevabı Markdown formatında ver. Başlıklar için ### kullan.`;
    mutate({ imageUrl: photoUrl, aiprompt: structuredPrompt });
  };

  const handleReset = (e: React.MouseEvent) => {
    stopEvent(e);
    reset();
    setValidationError('');
  };

  const handleCloseAll = (e: React.MouseEvent) => {
    stopEvent(e);
    setIsOpen(false);
    setTimeout(() => {
      reset();
      setValidationError('');
    }, 300);
  };

  const handleLoginRedirect = (e: React.MouseEvent) => {
    stopEvent(e);
    router.push('/login');
  };

  const handlePromptChange = (val: string) => {
    setPrompt(val);
    setValidationError('');
  };

  if (!isOpen) {
    return (
      <AiTriggerButton
        onClick={(e) => {
          stopEvent(e);
          setIsOpen(true);
        }}
      />
    );
  }

  return (
    <div
      onClick={stopEvent}
      className="absolute inset-0 z-30 w-full h-full bg-gray-500/50 backdrop-blur-md text-white p-4 cursor-default flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h3 className="font-semibold text-sm text-gray-100 flex items-center gap-2">✨ Gemini Vision</h3>
        <button
          onClick={handleCloseAll}
          className="text-white text-xs bg-[#ef7464] hover:bg-[#ef7464ca] px-2 py-1 rounded transition-colors cursor-pointer"
        >
          Kapat
        </button>
      </div>

      {/* Main Content */}
      {!user ? (
        <Login onRedirect={handleLoginRedirect} />
      ) : (
        <AiAnalysisForm
          prompt={prompt}
          isPending={isPending}
          error={error}
          validationError={validationError}
          onPromptChange={handlePromptChange}
          onAnalyze={handleAnalyze}
          stopEvent={stopEvent}
        />
      )}

      {/* Result Overlay */}
      {data && data.data && user && (
        <AiResultOverlay data={data} onClose={handleCloseAll} onReset={handleReset} stopEvent={stopEvent} />
      )}
    </div>
  );
}
