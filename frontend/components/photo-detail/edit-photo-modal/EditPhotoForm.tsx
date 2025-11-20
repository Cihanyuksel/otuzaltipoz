import { UseFormReturn } from 'react-hook-form';
import { PhotoEditFormValues } from 'lib/schemas';
import { ErrorMessage } from './ErrorMessage';
import { FormFields } from './FormFields';
import { FormFooter } from './FormFooter';

interface IEditPhotoForm {
  form: UseFormReturn<PhotoEditFormValues>;
  onSubmit: (data: PhotoEditFormValues) => void;
  onClose: () => void;
  isLoading: boolean;
  isPending: boolean;
  error: Error | null;
}

const EditPhotoForm = ({ form, onSubmit, onClose, isLoading, isPending, error }: IEditPhotoForm) => {
  return (
    <div className="p-6">
      <ErrorMessage error={error} />

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormFields form={form} isLoading={isLoading} />
        <FormFooter onClose={onClose} isLoading={isLoading} isPending={isPending} />
      </form>
    </div>
  );
};

export default EditPhotoForm;
