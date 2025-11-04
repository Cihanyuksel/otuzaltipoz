import { useState, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProfileUpdateFormValues } from 'lib/schemas';
import Input from '@/components/common/input';
import Button from '@/components/common/button';
import { FaUser as UserIcon } from 'react-icons/fa';
import { FiUpload as UploadIcon, FiX as CloseIcon } from 'react-icons/fi';
import { User } from 'types/auth';

interface IEditProfileTab {
  isPending: boolean;
  handleClose: () => void;
  user: User;
  form: UseFormReturn<ProfileUpdateFormValues> & {
    onSubmit: (data: ProfileUpdateFormValues) => void;
    isSubmitting: boolean;
  };
}

const EditProfileTab: React.FC<IEditProfileTab> = ({ isPending, handleClose, user, form }) => {
  const [previewImage, setPreviewImage] = useState<string | null>(user.profile_img_url || null);
  console.log(user, 'profile tab');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue('profile_img', e.target.files);
      form.setValue('removeProfileImg', false);
      form.clearErrors('profile_img');
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setSelectedFile(null);
    form.setValue('profile_img', undefined);
    form.setValue('removeProfileImg', true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <form onSubmit={form.handleSubmit(form.onSubmit)} className="space-y-6">
      {/* Profile Image Section */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
            {previewImage ? (
              <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#ef7464] to-[#d65d4f]">
                <UserIcon className="w-16 h-16 text-white" />
              </div>
            )}
          </div>
          {previewImage && (
            <button
              type="button"
              onClick={handleRemoveImage}
              disabled={isPending}
              className="absolute -top-2 -right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Fotoğrafı Kaldır"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-col items-center space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleImageChange}
            disabled={isPending}
            className="hidden"
          />
          <Button
            type="button"
            onClick={handleUploadClick}
            variant="secondary"
            size="small"
            disabled={isPending}
            className="flex items-center gap-2"
          >
            <UploadIcon className="w-4 h-4" />
            {previewImage ? 'Fotoğrafı Değiştir' : 'Fotoğraf Yükle'}
          </Button>
          <p className="text-xs text-gray-500 text-center">JPG, PNG veya WEBP. Maksimum 5MB</p>
          {form.formState.errors.profile_img && (
            <p className="text-sm text-red-600">{form.formState.errors.profile_img.message as string}</p>
          )}
        </div>
      </div>

      {/* Full Name Input */}
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

      {/* Bio Textarea */}
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
        <p className="text-xs text-gray-500 mt-1">{form.watch('bio')?.length || 0} / 250 karakter</p>
      </div>

      {/* Root Error */}
      {form.formState.errors.root && (
        <div className="text-red-600 text-sm p-3 bg-red-50 rounded-md border border-red-200">
          {form.formState.errors.root.message}
        </div>
      )}

      {/* Action Buttons */}
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
