import PhotoList from '@/components/photos/photo-list/PhotoList';
import Loader from '@/common/loader';
import LoadMoreIndicator from './LoadMoreIndicator';
import { SearchBar } from './SearchBar';

interface IPhotoContent {
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
  photosError: any;
}

const PhotoContent = ({
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
  photosError,
}: IPhotoContent) => {
  return (
    <section className="flex-1 overflow-y-auto p-4 bg-gray-100" id="scroll-container" aria-label="Fotoğraf Listesi">
      <div className="mb-6 w-full lg:w-3/4 xl:w-1/2  ">
        <SearchBar value={searchValue} onChange={setSearchValue} />
      </div>
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

        <LoadMoreIndicator
          loadMoreRef={loadMoreRef}
          isFetchingNextPage={isFetchingNextPage}
          isCategoriesLoading={isCategoriesLoading}
          hasNextPage={hasNextPage}
          showNoResults={showNoResults}
        />
      </div>
    </section>
  );
};

export default PhotoContent;
