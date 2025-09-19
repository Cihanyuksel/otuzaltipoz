'use client';
import Image from 'next/image';
import { useState } from 'react';

interface ReplyFormProps {
  userPhoto?: string;
  onSubmit: (text: string) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  replyingTo?: string;
}

export default function ReplyForm({ userPhoto, onSubmit, onCancel, isSubmitting, replyingTo }: ReplyFormProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex items-start gap-4">
      <Image src={userPhoto || '/no_profile.png'} alt="Profil" width={32} height={32} className="h-8 w-8 object-cover flex-shrink-0 rounded-full" />
      <div className="w-full">
        <textarea
          className="form-textarea w-full p-2 rounded-md border-gray-300 bg-gray-50 text-xs focus:border-blue-500 focus:ring-blue-500"
          placeholder={`${replyingTo ? '@' + replyingTo + ' kullanıcısına yanıt ver...' : 'Yanıt yaz...'}`}
          rows={2}
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoFocus
        />
        <div className="flex gap-2 mt-1">
          <button
            type="submit"
            className="px-4 py-2 text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting || !text.trim()}
          >
            {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} className="px-4 py-2 text-xs font-medium text-gray-500 hover:text-gray-700 rounded-md">
              İptal
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
