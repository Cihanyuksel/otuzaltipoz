'use client';
import { useState } from 'react';
import Button from '../common/button';
import TextArea from '../common/text-area';

interface IEditCommentForm {
  initialText: string;
  onSubmit: (text: string) => void;
  isSubmitting?: boolean;
  onCancel: () => void;
}

export default function EditCommentForm({ initialText, onSubmit, isSubmitting, onCancel }: IEditCommentForm) {
  const [text, setText] = useState(initialText);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length > 140) {
      setError('Yorum 140 karakterden uzun olamaz.');
      return;
    }

    if (text.trim() && text.trim() !== initialText.trim()) {
      onSubmit(text.trim());
    } else if (text.trim() === initialText.trim()) {
      onCancel();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);

    if (error) {
      setError('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <TextArea value={text} onChange={handleChange} autoFocus />

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      <div className="flex gap-2 mt-2">
        <Button
          type="submit"
          variant="primary"
          size="small"
          className="disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting || !text.trim()}
        >
          {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
        </Button>

        <Button type="button" variant="tertiary" size="small" onClick={onCancel} disabled={isSubmitting}>
          İptal
        </Button>
      </div>
    </form>
  );
}
