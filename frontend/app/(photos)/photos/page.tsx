import Loader from '@/components/common/loader';
import PhotoContainer from '@/components/photos/PhotoContainer';
import { Suspense } from 'react';

export default function PhotosPage() {
  return (
    <Suspense fallback={<Loader />}>
      <div className="flex-1">
        <PhotoContainer />
      </div>
    </Suspense>
  );
}
