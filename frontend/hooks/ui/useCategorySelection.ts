import { useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

export const useCategorySelection = (
  selectedCategories: string[],
  setSelectedCategories: (cats: string[]) => void,
  searchQuery: string,
  MAX_CATEGORIES = 3
) => {
  const searchParams = useSearchParams();

  const updateUrl = (newCategories: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    newCategories.length > 0 ? params.set('categories', newCategories.join(',')) : params.delete('categories');

    searchQuery ? params.set('search', searchQuery) : params.delete('search');

    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    window.history.replaceState(null, '', newUrl);
  };

  //router rsc'yi tetiklediği için window.history kullandık
  const handleCategoryClick = useCallback(
    (categoryName: string) => {
      let newCategories = [...selectedCategories];
      if (newCategories.includes(categoryName)) {
        newCategories = newCategories.filter((cat) => cat !== categoryName);
      } else {
        if (newCategories.length >= MAX_CATEGORIES) {
          toast.error(`Maksimum ${MAX_CATEGORIES} kategori seçebilirsiniz.`);
          return;
        }
        newCategories.push(categoryName);
      }
      setSelectedCategories(newCategories);
      updateUrl(newCategories);
    },
    [selectedCategories, setSelectedCategories, searchQuery, searchParams]
  );

  const handleRemoveCategory = useCallback(
    (categoryName: string) => {
      const newCategories = selectedCategories.filter((cat) => cat !== categoryName);
      setSelectedCategories(newCategories);
      updateUrl(newCategories);
    },
    [selectedCategories, setSelectedCategories, searchQuery, searchParams]
  );

  return { handleCategoryClick, handleRemoveCategory };
};
