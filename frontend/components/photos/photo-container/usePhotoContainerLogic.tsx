import { useState, useMemo } from 'react';
import { useCategories } from '@/hooks/api/useCategories';
import { useCategorySelection } from '@/hooks/ui/useCategorySelection';
import { useDebouncedValue } from '@/hooks/ui/useDebouncedValue';
import { useResponsiveSidebar } from '@/hooks/ui/useResponsiveSidebar';
import { getSections } from '../category/SectionConfig';
import { MAX_CATEGORIES } from './constant';

interface IUsePhotoContainerLogic {
  searchValue: string;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  photos: any[] | undefined;
  isPhotosLoading: boolean;
}

export const usePhotoContainerLogic = ({
  searchValue,
  selectedCategories,
  setSelectedCategories,
  photos,
  isPhotosLoading,
}: IUsePhotoContainerLogic) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Categories: true,
  });

  const { categories, isLoading: isCategoriesLoading } = useCategories();

  const { handleCategoryClick, handleRemoveCategory } = useCategorySelection({
    selectedCategories,
    setSelectedCategories,
    searchQuery: searchValue,
    maxCategories: MAX_CATEGORIES,
  });

  const { isSidebarOpen, setIsSidebarOpen, isMobileMenuOpen, setIsMobileMenuOpen } = useResponsiveSidebar();

  const debouncedSearchValue = useDebouncedValue(searchValue, 2000);
  const sections = useMemo(() => getSections(categories), [categories]);

  const handleSectionToggle = (title: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const isDebouncing = searchValue !== debouncedSearchValue;

  const showNoResults =
    !isPhotosLoading &&
    !isDebouncing &&
    photos?.length === 0 &&
    (debouncedSearchValue.length > 0 || selectedCategories.length > 0);

  return {
    sections,
    openSections,
    handleSectionToggle,
    handleCategoryClick,
    handleRemoveCategory,
    isSidebarOpen,
    setIsSidebarOpen,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    debouncedSearchValue,
    isDebouncing,
    showNoResults,
    isCategoriesLoading,
  };
};




