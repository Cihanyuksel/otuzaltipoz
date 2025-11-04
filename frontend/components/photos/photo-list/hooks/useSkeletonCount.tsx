import { useState, useEffect } from 'react';
import { SKELETON_COUNTS } from '../constants';

export const useSkeletonCount = () => {
  const [skeletonCount, setSkeletonCount] = useState<number>(SKELETON_COUNTS.LARGE);

  useEffect(() => {
    const updateSkeletonCount = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setSkeletonCount(SKELETON_COUNTS.SMALL);
      } else if (width < 1024) {
        setSkeletonCount(SKELETON_COUNTS.MEDIUM);
      } else if (width < 1536) {
        setSkeletonCount(SKELETON_COUNTS.LARGE);
      } else {
        setSkeletonCount(SKELETON_COUNTS.EXTRA_LARGE);
      }
    };

    updateSkeletonCount();
    window.addEventListener('resize', updateSkeletonCount);

    return () => window.removeEventListener('resize', updateSkeletonCount);
  }, []);

  return skeletonCount;
};
