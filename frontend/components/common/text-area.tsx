'use client';
import React from 'react';

type ITextArea = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  autoFocus?: boolean;
  className?: string;
};

const TextArea: React.FC<ITextArea> = ({
  value,
  onChange,
  placeholder = '',
  rows = 3,
  autoFocus = false,
  className = '',
}) => {
  return (
    <textarea
      className={`w-full p-2 rounded-md text-sm border-2 border-gray-300 bg-gray-50 outline-none focus:!border-[#ef7464] ${className}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      autoFocus={autoFocus}
    />
  );
};

export default TextArea;
