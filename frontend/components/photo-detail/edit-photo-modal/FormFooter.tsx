import Button from '@/common/button';
import { LoadingSpinner } from './LoadingSpinner';

interface FormFooterProps {
  onClose: () => void;
  isLoading: boolean;
  isPending: boolean;
}

export const FormFooter = ({ onClose, isLoading, isPending }: FormFooterProps) => {
  return (
    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
      <Button onClick={onClose} type="button" variant="tertiary" size="medium" disabled={isLoading}>
        İptal
      </Button>
      <Button disabled={isPending} type="submit" variant="primary" size="medium">
        {isPending ? <LoadingSpinner text="Kaydediliyor..." /> : 'Kaydet'}
      </Button>
    </div>
  );
};
