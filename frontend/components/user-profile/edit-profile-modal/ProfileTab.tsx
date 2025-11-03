import { UseFormReturn } from 'react-hook-form';
import { ProfileUpdateFormValues } from 'lib/schemas';
import Input from '@/components/common/input';
import Button from '@/components/common/button';

interface IEditProfileTab {
  isPending: boolean;
  handleClose: () => void;
  form: UseFormReturn<ProfileUpdateFormValues> & {
    onSubmit: (data: ProfileUpdateFormValues) => void;
    isSubmitting: boolean;
  };
}

const EditProfileTab: React.FC<IEditProfileTab> = ({ isPending, handleClose, form }) => {
  return (
    <form onSubmit={form.handleSubmit(form.onSubmit)} className="space-y-4">
      <Input
        id="full_name"
        type="text"
        name="full_name"
        register={form.register}
        error={form.formState.errors.full_name?.message}
        label="İsim Soyisim"
        disabled={isPending}
        placeholder="İsim Soyisim"
      />
      <div className="flex flex-col w-full">
        <label htmlFor="bio" className="mb-1 text-sm font-medium text-gray-700">
          Biyografi
        </label>
        <textarea
          id="bio"
          rows={4}
          {...form.register('bio')}
          disabled={isPending}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ef7464] focus:border-[#ef7464] disabled:bg-gray-50 disabled:cursor-not-allowed resize-none"
          placeholder="Kendinizden bahsedin..."
        />
        {form.formState.errors.bio && <p className="mt-1 text-sm text-red-600">{form.formState.errors.bio.message}</p>}
        <p className="text-xs text-gray-500 mt-1">{form.watch('bio')?.length || 0} / 500 karakter</p>
      </div>

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
          {form.isSubmitting ? 'Kaydediliyor...' : 'Profili Güncelle'}
        </Button>
      </div>
    </form>
  );
};

export default EditProfileTab;
