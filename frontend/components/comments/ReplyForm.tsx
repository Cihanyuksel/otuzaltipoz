'use client';
import Image from 'next/image';
import { useState } from 'react';
import Button from '../common/button';
import TextArea from '../common/text-area';

interface IReplyForm {
  userPhoto?: string;
  onSubmit: (text: string) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  replyingTo?: string;
}

export default function ReplyForm({ userPhoto, onSubmit, onCancel, isSubmitting, replyingTo }: IReplyForm) {
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
      <Image
        src={userPhoto || '/no_profile.png'}
        alt="Profil"
        width={32}
        height={32}
        className="h-8 w-8 object-cover flex-shrink-0 rounded-full"
      />
      <div className="w-full">
        <TextArea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={replyingTo ? `@${replyingTo} kullanıcısına yanıt ver...` : 'Yanıt yaz...'}
          autoFocus
        />

        <div className="flex gap-2 mt-1">
          <Button type="submit" variant="primary" size="small" disabled={isSubmitting || !text.trim()}>
            {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
          </Button>
          {onCancel && (
            <Button type="button" variant="tertiary" size="small" onClick={onCancel}>
              İptal
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
