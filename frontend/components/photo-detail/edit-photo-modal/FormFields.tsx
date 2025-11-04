import { UseFormReturn } from 'react-hook-form';
import Input from '@/common/input';
import { PhotoEditFormValues } from 'lib/schemas';
import { FORM_PLACEHOLDERS } from './constants';

interface FormFieldsProps {
  form: UseFormReturn<PhotoEditFormValues>;
  isLoading: boolean;
}

export const FormFields = ({ form, isLoading }: FormFieldsProps) => {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <>
      {/* Title */}
      <Input
        id="title"
        type="text"
        name="title"
        register={register}
        error={errors.title?.message}
        label="Başlık"
        disabled={isLoading}
        placeholder={FORM_PLACEHOLDERS.TITLE}
      />

      {/* Description */}
      <div className="flex flex-col w-full mt-2 mb-2">
        <label htmlFor="description" className="mb-1 text-sm font-medium text-gray-700">
          Açıklama
        </label>
        <textarea
          id="description"
          rows={4}
          {...register('description')}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ef7464] focus:border-[#ef7464] disabled:bg-gray-50 disabled:cursor-not-allowed resize-none"
          placeholder={FORM_PLACEHOLDERS.DESCRIPTION}
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
      </div>

      {/* Tag */}
      <Input
        id="tags"
        type="text"
        name="tags"
        register={register}
        error={errors.tags?.message}
        label="Etiketler"
        disabled={isLoading}
        placeholder={FORM_PLACEHOLDERS.TAGS}
      />
      <p className="mt-1 text-xs text-gray-500">Etiketleri virgülle ayırarak girebilirsiniz</p>
    </>
  );
};
