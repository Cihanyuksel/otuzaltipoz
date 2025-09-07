'use client';
//components
import { CommentSection, PhotoImage, PhotoInfo, RatingSection, UploaderInfo } from '@/components/photo-detail';
//others
import { useGetPhoto } from '@/hooks/usePhotoApi';
import { useAuth } from '@/context/AuthContext';
import { useParams } from 'next/navigation';
import Loader from '../common/loader';

const PhotoDetail = () => {
  const user = useAuth();

  const params = useParams();
  const photoId = params.id as string;
  const { data: photo, isLoading, isError } = useGetPhoto(photoId);

  if (isLoading) return <span><Loader/></span>;
  if (isError || !photo) return <p>Fotoğraf bulunamadı</p>;

  return (
    <section
      className="h-full flex justify-center py-4 bg-neutral-100 text-gray-800 min-h-screen px-4 md:px-0"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <div className="w-full max-w-5xl">
        <div className="bg-white shadow-sm">
          <PhotoImage photoUrl={photo.photo_url} title={photo.title} />
          <div className="p-6 w-full">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="md:col-span-2">
                <PhotoInfo title={photo.title} description={photo.description} tags={photo.tags} />
                <UploaderInfo user={photo.user} />
              </div>

              <RatingSection />
            </div>
            <CommentSection userPhoto={user.user?.profile_img_url} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhotoDetail;