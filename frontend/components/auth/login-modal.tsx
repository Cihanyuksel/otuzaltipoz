'use client';
import { useRef } from 'react';
import LoginForm from './login';
import { FaTimes as CloseIcon } from 'react-icons/fa';

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
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-5 backdrop-blur-sm"
    >
      <div
        ref={modalContentRef}
        className="relative rounded-xl bg-[#f5f0e9] p-10 m-4 w-full max-w-lg shadow-xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 cursor-pointer"
        >
          <CloseIcon />
        </button>
        <LoginForm />
      </div>
    </div>
  );
}
