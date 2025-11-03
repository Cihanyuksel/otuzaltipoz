import { UseFormReturn } from 'react-hook-form';
import { UsernameUpdateFormValues } from 'lib/schemas';
import Input from '@/components/common/input';
import Button from '@/components/common/button';

interface IUsernameTab {
  userUsername: string;
  canChangeUsername: boolean;
  isPending: boolean;
  handleClose: () => void;
  form: UseFormReturn<UsernameUpdateFormValues> & {
    onSubmit: (data: UsernameUpdateFormValues) => void;
    isSubmitting: boolean;
  };
}

const EditUsernameTab: React.FC<IUsernameTab> = ({
  userUsername,
  canChangeUsername,
  isPending,
  handleClose,
  form,
}) => {
  return (
    <form onSubmit={form.handleSubmit(form.onSubmit)} className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <p className="text-sm text-blue-800">
          <strong>Mevcut Kullanıcı Adı:</strong> @{userUsername}
        </p>
        <p className="text-xs text-blue-600 mt-1">
          {canChangeUsername
            ? '⚠️ Kullanıcı adını sadece 1 kez değiştirebilirsiniz!'
            : '❌ Kullanıcı adı değiştirme hakkınız doldu'}
        </p>
      </div>

      {canChangeUsername ? (
        <>
          <Input
            id="username"
            type="text"
            name="username"
            register={form.register}
            error={form.formState.errors.username?.message}
            label="Yeni Kullanıcı Adı"
            disabled={isPending}
            placeholder="yeni_kullanici_adi"
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
              {form.isSubmitting ? 'Değiştiriliyor...' : 'Kullanıcı Adını Değiştir'}
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">Kullanıcı adı değiştirme hakkınız kalmadı.</p>
        </div>
      )}
    </form>
  );
};

export default EditUsernameTab;
