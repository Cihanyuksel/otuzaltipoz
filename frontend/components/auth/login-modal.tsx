'use client';
import React, { useState, useEffect, useRef } from 'react';
import LoginForm from './login';
import { FaTimes as CloseIcon } from 'react-icons/fa';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ANIMATION_DURATION = 300; 

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const modalContentRef = useRef<HTMLDivElement>(null);
  
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isModalVisible, setIsModalVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      
      const timer = setTimeout(() => {
        setIsModalVisible(true); 
      }, 20); 
      
      return () => clearTimeout(timer); 
      
    } else {
      setIsModalVisible(false);
      const timer = setTimeout(() => {
        setShouldRender(false); 
      }, ANIMATION_DURATION);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) {
    return null;
  }

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  const backdropClasses = `
    fixed inset-0 z-50 flex items-center justify-center 
    bg-opacity-5 backdrop-blur-sm 
    transition-opacity duration-${ANIMATION_DURATION}
    ${isModalVisible ? 'opacity-100' : 'opacity-0'}
  `;

  const modalContentClasses = `
    relative rounded-xl bg-[#f5f0e9] p-10 m-4 w-full max-w-lg shadow-xl
    transform transition-all duration-${ANIMATION_DURATION} ease-out
    ${isModalVisible 
      ? 'scale-100 opacity-100 translate-y-0' 
      : 'scale-95 opacity-0 translate-y-2'}
  `;
  
  const backdropClassName = backdropClasses.replace(/\s+/g, ' ').trim();
  const modalContentClassName = modalContentClasses.replace(/\s+/g, ' ').trim();

  return (
    <div
      onClick={handleBackdropClick}
      className={backdropClassName}
    >
      <div
        ref={modalContentRef}
        className={modalContentClassName}
        onClick={(e) => e.stopPropagation()} 
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