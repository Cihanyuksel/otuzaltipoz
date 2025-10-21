import Image from 'next/image';
import { FaRegComments as CommentIcon } from 'react-icons/fa';
import { useState } from 'react';
import Button from '../common/button';

interface ICommentForm {
  userPhoto?: string;
  onSubmit: (text: string) => void;
  isSubmitting?: boolean;
  placeholder?: string;
  token: string | null;
}

export default function CommentForm({ userPhoto, onSubmit, isSubmitting, placeholder, token }: ICommentForm) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length > 140) {
      setError('Yorum 140 karakterden uzun olamaz.');
      return;
    }

    if (text.trim()) {
      onSubmit(text);
      setText('');
      setError('');
    }
  };

  const isLoggedIn = !!token;

  return (
    <form onSubmit={handleSubmit} className="flex items-start gap-4 w-full">
      <Image
        src={userPhoto || '/no_profile.png'}
        alt="Profil"
        width={40}
        height={40}
        className="h-10 w-10 object-cover flex-shrink-0 rounded-full"
      />
      <div className="w-full">
        <textarea
          className="form-textarea w-full p-2 rounded-md border-gray-300 bg-gray-100 text-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder={placeholder || 'Yorum ekle...'}
          rows={3}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (error) {
              setError('');
            }
          }}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

        <Button
          type="submit"
          variant="primary"
          size="medium"
          className="disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting || !text || !isLoggedIn}
        >
          <CommentIcon />
          {isSubmitting ? 'Ekleniyor...' : 'Yorum Yap'}
        </Button>
      </div>
    </form>
  );
}
