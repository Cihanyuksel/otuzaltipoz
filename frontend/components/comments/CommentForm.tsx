'use client';
import Image from 'next/image';
import { FaRegComments as CommentIcon } from 'react-icons/fa';
import { useState } from 'react';

interface CommentFormProps {
  userPhoto?: string;
  onSubmit: (text: string) => void;
  isSubmitting?: boolean;
  placeholder?: string;
}

export default function CommentForm({ userPhoto, onSubmit, isSubmitting, placeholder }: CommentFormProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-start gap-4 w-full">
      <Image src={userPhoto || '/no_profile.png'} alt="Profil" width={40} height={40} className="h-10 w-10 object-cover flex-shrink-0 rounded-full" />
      <div className="w-full">
        <textarea
          className="form-textarea w-full p-2 rounded-md border-gray-300 bg-gray-100 text-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder={placeholder || 'Yorum ekle...'}
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="submit"
          className="mt-1 rounded-lg border-gray-200 border h-10 px-6 text-xs md:text-sm font-medium text-blue-500 transition-colors hover:bg-gray-100 cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting || !text.trim()}
        >
          <CommentIcon />
          {isSubmitting ? 'Ekleniyor...' : 'Yorum Yap'}
        </button>
      </div>
    </form>
  );
}
