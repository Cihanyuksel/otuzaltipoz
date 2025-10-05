'use client';
//nextjs and react
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
//project files
import PhotoList from '@/components/photos/PhotoList';
import Loader from '../common/loader';
import MobileHeader from './category/MobileHeader';
import MobileMenu from './category/MobileMenu';
import Sidebar from './category/Sidebar';
import { getSections } from './category/SectionConfig';
import { useSearch } from '@/context/SearchContext';
import { usePhotos } from '@/context/PhotoContext';
import { useCategories } from '@/hooks/api/useCategories';
import { useCategorySelection } from '@/hooks/ui/useCategorySelection';
import { useDebouncedValue } from '@/hooks/ui/useDebouncedValue';
import { useResponsiveSidebar } from '@/hooks/ui/useResponsiveSidebar';

const PhotoContainer = () => {
  const { searchValue: searchQuery } = useSearch();
  const searchParams = useSearchParams();
  const {
    photos,
    isLoading: isPhotosLoading,
    error: photosError,
    selectedCategories,
    setSelectedCategories,
  } = usePhotos();
  const MAX_CATEGORIES = 3;
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({ Kategoriler: true });
  const debouncedSearchValue = useDebouncedValue(searchQuery, 2000);
  const { handleCategoryClick, handleRemoveCategory } = useCategorySelection(
    selectedCategories,
    setSelectedCategories,
    searchQuery,
    3
  );
  const { isSidebarOpen, setIsSidebarOpen, isMobileMenuOpen, setIsMobileMenuOpen } = useResponsiveSidebar();
  const { categories, isLoading } = useCategories();

  useEffect(() => {
    const categoriesFromUrl = searchParams.get('categories');
    if (categoriesFromUrl) {
      const categoriesArray = categoriesFromUrl.split(',').filter(Boolean);
      if (JSON.stringify(categoriesArray) !== JSON.stringify(selectedCategories)) {
        setSelectedCategories(categoriesArray);
      }
    } else if (selectedCategories.length > 0) {
      setSelectedCategories([]);
    }
  }, [searchParams, selectedCategories]);

  const isDebouncing = searchQuery !== debouncedSearchValue;
  const sections = getSections(categories);

  const handleSectionToggle = (title: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  if (isLoading && categories.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
        <p className="ml-2 text-gray-600">Kategoriler yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <MobileHeader
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        selectedCategories={selectedCategories}
        MAX_CATEGORIES={MAX_CATEGORIES}
      />
      <MobileMenu
        isMobileMenuOpen={isMobileMenuOpen}
        categorySection={sections}
        openSections={openSections}
        handleSectionToggle={handleSectionToggle}
        selectedCategories={selectedCategories}
        handleCategoryClick={handleCategoryClick}
        handleRemoveCategory={handleRemoveCategory}
      />

      <div className="flex flex-1 relative">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          categorySection={sections}
          openSections={openSections}
          handleSectionToggle={handleSectionToggle}
          selectedCategories={selectedCategories}
          handleCategoryClick={handleCategoryClick}
          handleRemoveCategory={handleRemoveCategory}
          MAX_CATEGORIES={MAX_CATEGORIES}
        />

        {/* Main Section */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {isPhotosLoading || isDebouncing ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                <Loader />
              </div>
            ) : photos?.length === 0 && (debouncedSearchValue.length > 0 || selectedCategories.length > 0) ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                Aradığınız kriterlere uygun fotoğraf bulunamadı. Lütfen başka bir anahtar kelime veya kategori deneyin.
              </div>
            ) : (
              <PhotoList photos={photos || []} isLoading={isPhotosLoading} error={photosError} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PhotoContainer;
