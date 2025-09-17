import Loader from '@/components/common/loader';
import PhotoDetail from '@/components/photo-detail/PhotoDetail';
import { Suspense } from 'react';

const PhotoDetailPage = () => {
  return (
    <Suspense fallback={<Loader />}>
      <PhotoDetail />;
    </Suspense>
  );
};

export default PhotoDetailPage;
