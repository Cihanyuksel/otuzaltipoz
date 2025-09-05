'use client';
//components
import CommentSection from '@/components/photo-detail/comment-seciton';
import PhotoImage from '@/components/photo-detail/photo-image';
import PhotoInfo from '@/components/photo-detail/photo-info';
import RatingSection from '@/components/photo-detail/rating-section';
import UploaderInfo from '@/components/photo-detail/uploader-info';
import { useAuth } from '@/context/AuthContext';
//others
import { useGetPhoto } from '@/hooks/usePhotoApi';
import { useParams } from 'next/navigation';

const PhotoDetail = () => {

  const user = useAuth()

  const params = useParams();
  const photoId = params.id as string;
  const { data: photo, isLoading, isError } = useGetPhoto(photoId);

  if (isLoading) return <p>Yükleniyor...</p>;
  if (isError || !photo) return <p>Fotoğraf bulunamadı</p>;

  return (
    <section
      className="flex justify-center py-8 bg-gray-50 text-gray-800 min-h-screen"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <div className="w-full max-w-5xl px-4">
        <div className="bg-white shadow-sm">
          <PhotoImage photoUrl={photo.photo_url} title={photo.title} />
          <div className="p-6 w-full">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
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
