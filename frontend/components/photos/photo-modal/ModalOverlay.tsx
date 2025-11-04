import { motion } from 'framer-motion';
import { ANIMATION_CONFIG } from './constants';

interface ModalOverlayProps {
  onClose: () => void;
  children: React.ReactNode;
}

export const ModalOverlay: React.FC<ModalOverlayProps> = ({ onClose, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: ANIMATION_CONFIG.EXIT_DURATION } }}
      transition={{ duration: ANIMATION_CONFIG.ENTER_DURATION }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black"
      onClick={onClose}
    >
      {children}
    </motion.div>
  );
};