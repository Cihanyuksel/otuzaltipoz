import { UseFormReturn } from 'react-hook-form';
import { PasswordUpdateFormValues } from 'lib/schemas';
import Input from '@/components/common/input';
import Button from '@/components/common/button';

interface EditPasswordTabProps {
  isPending: boolean;
  handleClose: () => void;
  form: UseFormReturn<PasswordUpdateFormValues> & {
    onSubmit: (data: PasswordUpdateFormValues) => void;
    isSubmitting: boolean;
  };
}

const EditPasswordTab: React.FC<EditPasswordTabProps> = ({ isPending, handleClose, form }) => {
  return (
    <form onSubmit={form.handleSubmit(form.onSubmit)} className="space-y-4">
      <Input
        id="currentPassword"
        type="password"
        name="currentPassword"
        register={form.register}
        error={form.formState.errors.currentPassword?.message}
        label="Mevcut Şifre"
        disabled={isPending}
        placeholder="Mevcut şifreniz"
      />

      <Input
        id="newPassword"
        type="password"
        name="newPassword"
        register={form.register}
        error={form.formState.errors.newPassword?.message}
        label="Yeni Şifre"
        disabled={isPending}
        placeholder="En az 6 karakter"
      />

      <Input
        id="confirmPassword"
        type="password"
        name="confirmPassword"
        register={form.register}
        error={form.formState.errors.confirmPassword?.message}
        label="Yeni Şifre (Tekrar)"
        disabled={isPending}
        placeholder="Yeni şifrenizi tekrar girin"
      />

      {form.formState.errors.root && (
        <div className="text-red-600 text-sm p-3 bg-red-50 rounded-md border border-red-200">
          {form.formState.errors.root.message}
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button onClick={handleClose} type="button" variant="tertiary" size="medium" disabled={isPending}>
          İptal
        </Button>
        <Button disabled={isPending} type="submit" variant="primary" size="medium">
          {form.isSubmitting ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
        </Button>
      </div>
    </form>
  );
};

export default EditPasswordTab;
