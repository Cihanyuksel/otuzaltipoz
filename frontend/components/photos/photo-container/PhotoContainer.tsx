'use client';
import { useEffect, useRef } from 'react';
import { usePhotos } from '@/context/PhotoContext';
import { usePhotoContainerLogic } from './usePhotoContainerLogic';
import PhotoContainerLayout from './PhotoContainerLayout';

import MobileHeader from '../category/MobileHeader';
import MobileMenu from '../category/MobileMenu';
import Sidebar from '../category/Sidebar';
import PhotoContent from './PhotoContent';
import { MAX_CATEGORIES } from './constant';

const PhotoContainer = () => {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
    photos,
    selectedCategories,
    setSelectedCategories,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    searchQuery,
    isLoading: isPhotosLoading,
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
    isDebouncing,
    showNoResults,
    isCategoriesLoading,
  } = usePhotoContainerLogic({
    searchValue: searchQuery,
    selectedCategories,
    setSelectedCategories,
    photos,
    isPhotosLoading,
  });

  // Infinite scroll
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
      mobileHeader={
        <MobileHeader
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          selectedCategories={selectedCategories}
          MAX_CATEGORIES={MAX_CATEGORIES}
        />
      }
      mobileMenu={
        <MobileMenu
          isMobileMenuOpen={isMobileMenuOpen}
          categorySection={sections}
          openSections={openSections}
          handleSectionToggle={handleSectionToggle}
          selectedCategories={selectedCategories}
          handleCategoryClick={handleCategoryClick}
          handleRemoveCategory={handleRemoveCategory}
        />
      }
      sidebar={
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
      }
      content={
        <PhotoContent
          isPhotosLoading={isPhotosLoading}
          isDebouncing={isDebouncing}
          showNoResults={showNoResults}
          isCategoriesLoading={isCategoriesLoading}
          loadMoreRef={loadMoreRef}
        />
      }
    />
  );
};

export default PhotoContainer;
