'use client';
//nextjs and react
import { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
//project files
//components
import PhotoList from '@/components/photos/PhotoList';
import Loader from '@/common/loader';
import MobileHeader from './category/MobileHeader';
import MobileMenu from './category/MobileMenu';
import Sidebar from './category/Sidebar';
//context
import { useSearch } from '@/context/SearchContext';
import { usePhotos } from '@/context/PhotoContext';
//hooks
import { useCategories } from '@/hooks/api/useCategories';
import { useCategorySelection } from '@/hooks/ui/useCategorySelection';
import { useDebouncedValue } from '@/hooks/ui/useDebouncedValue';
import { useResponsiveSidebar } from '@/hooks/ui/useResponsiveSidebar';
//config
import { getSections } from './category/SectionConfig';

const MAX_CATEGORIES = 3;

const PhotoContainer = () => {
  const { searchValue: searchQuery } = useSearch();
  const searchParams = useSearchParams();

  const {
    photos,
    isLoading: isPhotosLoading,
    error: photosError,
    selectedCategories,
    setSelectedCategories,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePhotos();

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Kategoriler: true,
  });

  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const { handleCategoryClick, handleRemoveCategory } = useCategorySelection({
    selectedCategories,
    setSelectedCategories,
    searchQuery,
    maxCategories: MAX_CATEGORIES,
  });

  const { isSidebarOpen, setIsSidebarOpen, isMobileMenuOpen, setIsMobileMenuOpen } = useResponsiveSidebar();
  const debouncedSearchValue = useDebouncedValue(searchQuery, 2000);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

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

  const isDebouncing = searchQuery !== debouncedSearchValue;
  const sections = useMemo(() => getSections(categories), [categories]);

  const handleSectionToggle = (title: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const showNoResults =
    !isPhotosLoading &&
    !isDebouncing &&
    photos?.length === 0 &&
    (debouncedSearchValue.length > 0 || selectedCategories.length > 0);

  if (photosError) {
    return (
      <div className="flex flex-col min-h-screen">
        <MobileHeader
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          selectedCategories={selectedCategories}
          MAX_CATEGORIES={MAX_CATEGORIES}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center py-8 text-red-500">
            Fotoğraflar yüklenirken bir hata oluştu: {photosError.message}
          </div>
        </div>
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

        <section className="flex-1 overflow-y-auto p-4 bg-gray-100" id="scroll-container" aria-label="Fotoğraf Listesi">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {isPhotosLoading || isDebouncing ? (
              <div className="col-span-full text-center py-8 text-gray-500" aria-live="polite">
                <Loader />
              </div>
            ) : showNoResults ? (
              <div className="col-span-full text-center py-8 text-gray-500" role="status">
                Aradığınız kriterlere uygun fotoğraf bulunamadı. Lütfen başka bir anahtar kelime veya kategori deneyin.
              </div>
            ) : (
              <PhotoList
                photos={photos || []}
                isLoading={isPhotosLoading}
                error={photosError}
                isFetchingNextPage={isFetchingNextPage}
              />
            )}

            <div
              data-testid="load-more"
              ref={loadMoreRef}
              className="col-span-full flex justify-center py-6 min-h-[20px]"
              aria-live="polite"
            >
              {(isFetchingNextPage || isCategoriesLoading) && <Loader />}
              {!isFetchingNextPage && !isCategoriesLoading && (
                <>
                  {hasNextPage && (
                    <p className="text-gray-500 text-lg font-semibold animate-pulse">
                      Daha fazla fotoğraf yükleniyor...
                    </p>
                  )}

                  {!hasNextPage && !showNoResults && (
                    <p className="text-gray-400 text-lg font-semibold">Tüm fotoğraflar yüklendi.</p>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PhotoContainer;
