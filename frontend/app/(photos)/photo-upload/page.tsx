import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import PhotoUploadForm from '@/components/photos/PhotoUploadForm';

const PhotoUploadPage = async () => {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get('refreshToken')?.value;
  if (!refreshToken) {
    redirect('/');
  }

  return (
    <PhotoUploadForm/>
  );
};

export default PhotoUploadPage;
