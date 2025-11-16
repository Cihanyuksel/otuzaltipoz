import Image from 'next/image';
import { FaRegComments as CommentIcon } from 'react-icons/fa';
import { useState } from 'react';
import Button from '../common/button';
import TextArea from '../common/text-area';

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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (error) setError('');
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
        <TextArea value={text} onChange={handleChange} placeholder={placeholder || 'Yorum ekle...'} />

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
