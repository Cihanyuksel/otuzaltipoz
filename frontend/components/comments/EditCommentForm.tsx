'use client';
import { useState } from 'react';
import { FiCheck as CheckIcon, FiX as CancelIcon } from 'react-icons/fi';
import Button from '../common/button';

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

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <textarea
        className="form-textarea w-full p-2 rounded-md border-gray-300 bg-white text-sm focus:border-blue-500 focus:ring-blue-500"
        rows={3}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          if (error) {
            setError('');
          }
        }}
        autoFocus
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      <div className="flex gap-2 mt-2">
        <Button
          type="submit"
          variant="primary"
          size="small"
          className="disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting || !text.trim()}
        >
          <CheckIcon />
          {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
        </Button>
        <Button type="button" variant="secondary" size="small" onClick={onCancel} disabled={isSubmitting}>
          <CancelIcon />
          İptal
        </Button>
      </div>
    </form>
  );
}
