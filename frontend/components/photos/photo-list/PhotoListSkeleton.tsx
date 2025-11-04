import { PhotoCardSkeleton } from './PhotoCardSkeleton';
import { useSkeletonCount } from './hooks/useSkeletonCount';

export const PhotoListSkeleton = () => {
  const skeletonCount = useSkeletonCount();

  return (
    <>
      {[...Array(skeletonCount)].map((_, index) => (
        <PhotoCardSkeleton key={`skeleton-${index}`} />
      ))}
    </>
  );
};
