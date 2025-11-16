'use client';
import Loader from '@/common/loader';
import { usePhotos } from '@/context/PhotoContext';

interface ILoadMoreIndicator {
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  isCategoriesLoading: boolean;
  showNoResults: boolean;
}

const LoadMoreIndicator = ({ loadMoreRef, isCategoriesLoading, showNoResults }: ILoadMoreIndicator) => {
  const { isFetchingNextPage, hasNextPage } = usePhotos();

  return (
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
            <p className="text-gray-500 text-lg font-semibold animate-pulse">Daha fazla fotoğraf yükleniyor...</p>
          )}

          {!hasNextPage && !showNoResults && (
            <p className="text-gray-400 text-lg font-semibold">Tüm fotoğraflar yüklendi.</p>
          )}
        </>
      )}
    </div>
  );
};

export default LoadMoreIndicator;
