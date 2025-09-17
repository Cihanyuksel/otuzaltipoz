'use client';

import { useRef } from 'react';
import LoginForm from './login';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const modalContentRef = useRef<HTMLDivElement>(null);

  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  return (
    <div onClick={handleBackdropClick} className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-5 backdrop-blur-sm">
      <div ref={modalContentRef} className="relative rounded-2xl bg-[#f5f0e9] p-10 m-4 w-full max-w-lg shadow-xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
          x
        </button>
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Giriş Yap</h2>
        <LoginForm />
      </div>
    </div>
  );
}
