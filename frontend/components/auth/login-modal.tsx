'use client';
import LoginForm from './login';
import ModalOverlay from '@/components/common/modal-overlay';
import CustomCloseButton from '@/components/common/close-button';
import ModalContent from '@/components/common/modal-content';

interface ILoginModal {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: ILoginModal) {
  return (
    <ModalOverlay onClose={onClose} isModalVisible={isOpen} isLoading={false}>
      <ModalContent isOpen={isOpen} className="bg-[#f5f0e9] rounded-xl p-10 m-4">
        <CustomCloseButton onClose={onClose} />
        <LoginForm />
      </ModalContent>
    </ModalOverlay>
  );
}
