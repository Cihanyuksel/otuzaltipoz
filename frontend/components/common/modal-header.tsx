import CustomCloseButton from '@/components/common/close-button';
import { MODAL_STYLES } from '../photo-detail/edit-photo-modal/constants';

interface IModalHeader {
  onClose: () => void;
  isLoading: boolean;
  title: string;
}

const ModalHeader = ({ onClose, isLoading, title }: IModalHeader) => {
  return (
    <div className={MODAL_STYLES.HEADER}>
      <h3 className="text-lg font-medium text-white border-b-2 border-transparent">{title}</h3>
      <CustomCloseButton
        onClose={onClose}
        className="static top-auto right-auto text-white hover:text-white bg-transparent hover:bg-white/10"
        disabled={isLoading}
      />
    </div>
  );
};

export default ModalHeader;
