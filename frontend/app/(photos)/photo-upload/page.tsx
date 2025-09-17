import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import PhotoUploadForm from '@/components/photos/PhotoUploadForm';
import { Suspense } from 'react';
import Loader from '@/components/common/loader';

const PhotoUploadPage = async () => {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get('refreshToken')?.value;
  if (!refreshToken) {
    redirect('/');
  }

  return (
    <Suspense fallback={<Loader />}>
      <PhotoUploadForm />
    </Suspense>
  );
};

export default PhotoUploadPage;
