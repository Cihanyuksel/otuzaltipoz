import { useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

interface IUseCategorySelection {
  selectedCategories: string[];
  setSelectedCategories: (cats: string[]) => void;
  searchQuery?: string;
  maxCategories?: number;
}

export const useCategorySelection = ({
  selectedCategories,
  setSelectedCategories,
  searchQuery = '',
  maxCategories = 3,
}: IUseCategorySelection) => {
  const searchParams = useSearchParams();

  const updateUrl = useCallback(
    (newCategories: string[]) => {
      const params = new URLSearchParams(searchParams.toString());

      if (newCategories.length > 0) {
        params.set('categories', newCategories.join(','));
      } else {
        params.delete('categories');
      }

      if (searchQuery) {
        params.set('search', searchQuery);
      } else {
        params.delete('search');
      }

      const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
      window.history.replaceState(null, '', newUrl);
    },
    [searchParams, searchQuery]
  );

  const handleCategoryClick = useCallback(
    (categoryName: string) => {
      let newCategories: string[];

      if (selectedCategories.includes(categoryName)) {
        newCategories = selectedCategories.filter((cat) => cat !== categoryName);
      } else {
        if (selectedCategories.length >= maxCategories) {
          toast.error(`Maksimum ${maxCategories} kategori seçebilirsiniz.`);
          return;
        }
        newCategories = [...selectedCategories, categoryName];
      }

      setSelectedCategories(newCategories);
      updateUrl(newCategories);
    },
    [selectedCategories, setSelectedCategories, maxCategories, updateUrl]
  );

  const handleRemoveCategory = useCallback(
    (categoryName: string) => {
      const newCategories = selectedCategories.filter((cat) => cat !== categoryName);
      setSelectedCategories(newCategories);
      updateUrl(newCategories);
    },
    [selectedCategories, setSelectedCategories, updateUrl]
  );

  return { handleCategoryClick, handleRemoveCategory };
};
