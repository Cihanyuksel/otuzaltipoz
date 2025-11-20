'use client';
import React from 'react';
import { IoCheckmarkCircleSharp as SuccessIcon } from 'react-icons/io5';
import ModalOverlay from '@/components/common/modal-overlay';
import ModalContent from '@/components/common/modal-content';

interface ISuccessModal {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
}

const SuccessModal = ({ isOpen, onClose, title, message }: ISuccessModal) => {
  return (
    <ModalOverlay isModalVisible={isOpen} onClose={onClose} isLoading={false}>
      <ModalContent isOpen={isOpen} className="w-full max-w-sm bg-white rounded-xl p-6 text-center">
        <div className="flex justify-center mb-4">
          <SuccessIcon className="w-14 h-14 text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
      </ModalContent>
    </ModalOverlay>
  );
};

export default SuccessModal;
