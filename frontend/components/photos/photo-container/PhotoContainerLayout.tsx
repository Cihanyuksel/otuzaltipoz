import MobileHeader from '../category/MobileHeader';
import MobileMenu from '../category/MobileMenu';
import Sidebar from '../category/Sidebar';
import { MAX_CATEGORIES } from './constant';
import PhotoContent from './PhotoContent';

interface IPhotoContainerLayout {
  photosError: any;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  selectedCategories: string[];
  sections: any[];
  openSections: Record<string, boolean>;
  handleSectionToggle: (title: string) => void;
  handleCategoryClick: (category: string) => void;
  handleRemoveCategory: (category: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  isPhotosLoading: boolean;
  isDebouncing: boolean;
  showNoResults: boolean;
  photos: any[] | undefined;
  isFetchingNextPage: boolean;
  isCategoriesLoading: boolean;
  hasNextPage: boolean;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
}

const PhotoContainerLayout = ({
  photosError,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  selectedCategories,
  sections,
  openSections,
  handleSectionToggle,
  handleCategoryClick,
  handleRemoveCategory,
  isSidebarOpen,
  setIsSidebarOpen,
  searchValue,
  setSearchValue,
  isPhotosLoading,
  isDebouncing,
  showNoResults,
  photos,
  isFetchingNextPage,
  isCategoriesLoading,
  hasNextPage,
  loadMoreRef,
}: IPhotoContainerLayout) => {
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

        <PhotoContent
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
          photosError={photosError}
        />
      </div>
    </div>
  );
};

export default PhotoContainerLayout;
