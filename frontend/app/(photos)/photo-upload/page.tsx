import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import PhotoUploadForm from '@/components/photos/photo-upload-form/PhotoUploadForm';
import { Suspense } from 'react';
import Loader from '@/components/common/loader';
import { createPageMetadata } from 'lib/metadata';

export const metadata = createPageMetadata({
  title: 'Fotoğraf Yükle | otuzaltıpoz',
  description: 'Fotoğraflarını yükle, paylaş ve arşivle. otuzaltıpoz topluluğuna katıl!',
  path: '/photo-upload',
  image: '/og-upload.jpg',
});

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
