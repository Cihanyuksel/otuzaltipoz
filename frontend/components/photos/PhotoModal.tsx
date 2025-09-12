// components/PhotoModal.js
'use client';
import React, { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface PhotoDocument {
  photo_url: string;
  title: string;
  description: string;
}

interface IPhotoModal {
  photos: PhotoDocument[]; 
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

const PhotoModal: React.FC<IPhotoModal> = ({ photos, currentIndex, onClose, onNavigate }) => {
  const isModalOpen = currentIndex !== null;
  const currentPhoto = isModalOpen ? photos[currentIndex] : null;
  
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      onNavigate('next');
    } else if (e.key === 'ArrowLeft') {
      onNavigate('prev');
    } else if (e.key === 'Escape') {
      onClose();
    }
  }, [onNavigate, onClose]);

  useEffect(() => {
    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, handleKeyDown]);

  if (!isModalOpen || !currentPhoto) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex} 
          initial={{ scale: 0.8 }}
          transition={{ duration: 0.1 }}
          className="relative w-full max-w-6xl max-h-[90vh] flex flex-col"
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          {/* Başlık */}
          <h1 className="absolute top-4 left-4 text-white text-3xl font-bold z-10">{currentPhoto.title}</h1>

          {/* Navigasyon Tuşları */}
          {photos.length > 1 && (
            <>
              {/* Sol Ok */}
              <button
                onClick={(e) => { e.stopPropagation(); onNavigate('prev'); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-3 rounded-full bg-black bg-opacity-40 hover:bg-opacity-60 z-20 transition"
              >
                <FaArrowLeft size={24} />
              </button>
              {/* Sağ Ok */}
              <button
                onClick={(e) => { e.stopPropagation(); onNavigate('next'); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-3 rounded-full bg-black bg-opacity-40 hover:bg-opacity-60 z-20 transition"
              >
                <FaArrowRight size={24} />
              </button>
            </>
          )}

          {/* Fotoğraf */}
          <div className="relative w-full h-full min-h-[500px]">
            <Image
              src={currentPhoto.photo_url}
              alt={currentPhoto.title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 80vw"
              priority
            />
          </div>

          {/* Açıklama */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-70 text-white">
            <p>{currentPhoto.description}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default PhotoModal;