import { PhotoEditFormValues } from 'lib/schemas';

export const transformFormData = (data: PhotoEditFormValues) => {
  return {
    ...data,
    tags: data.tags
      ? data.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      : undefined,
  };
};

export const getDefaultValues = (photo: any) => ({
  title: photo.title,
  description: photo.description || '',
  tags: photo.tags?.join(', ') || '',
});
