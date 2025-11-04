'use client';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePhotos } from '@/context/PhotoContext';
import { usePhotoContainerLogic } from './usePhotoContainerLogic';
import PhotoContainerLayout from './PhotoContainerLayout';

const PhotoContainer = () => {
  const searchParams = useSearchParams();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
    photos,
    isLoading: isPhotosLoading,
    error: photosError,
    selectedCategories,
    setSelectedCategories,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    searchValue,
    setSearchValue,
  } = usePhotos();

  const {
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
  } = usePhotoContainerLogic({
    searchValue,
    selectedCategories,
    setSelectedCategories,
    photos,
    isPhotosLoading,
  });

  // URL'den kategori senkronizasyonu
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
  }, [searchParams, selectedCategories, setSelectedCategories]);

  // Infinite scroll observer
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage || !loadMoreRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { root: null, rootMargin: '0px 0px 200px 0px', threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <PhotoContainerLayout
      photosError={photosError}
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
      selectedCategories={selectedCategories}
      sections={sections}
      openSections={openSections}
      handleSectionToggle={handleSectionToggle}
      handleCategoryClick={handleCategoryClick}
      handleRemoveCategory={handleRemoveCategory}
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      searchValue={searchValue}
      setSearchValue={setSearchValue}
      isPhotosLoading={isPhotosLoading}
      isDebouncing={isDebouncing}
      showNoResults={showNoResults}
      photos={photos}
      isFetchingNextPage={isFetchingNextPage}
      isCategoriesLoading={isCategoriesLoading}
      hasNextPage={hasNextPage}
      loadMoreRef={loadMoreRef}
    />
  );
};

export default PhotoContainer;
