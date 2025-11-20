import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import Loader from '@/components/common/loader';
import { createPageMetadata } from 'lib/metadata';
import PhotoUploadForm from '@/components/photos/photo-upload-form/PhotoUploadForm';
import WeeklyUploads from '@/components/photos/photo-upload-form/WeeklyUpload';
import UploadTips from '@/components/photos/photo-upload-form/UploadTips';

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
      <main className="grid grid-cols-1 items-start gap-8 bg-[#f5f1ea] py-10 px-4 lg:grid-cols-[1fr_2fr_1fr] xl:gap-8 xl:px-10 max-w-screen-2xl mx-auto">
        <WeeklyUploads />
        <section className="w-full">
          <PhotoUploadForm />
        </section>
        <UploadTips />
      </main>
    </Suspense>
  );
};

export default PhotoUploadPage;
