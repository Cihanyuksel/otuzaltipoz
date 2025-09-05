'use client';
import { useGetAllPhoto } from '../../../hooks/usePhotoApi';
import PhotoCard from '../../../component/photo-card';

export default function PhotoGallery() {
  const averageRating = 5;

  const { data: response, isLoading, isError, error } = useGetAllPhoto();
  const photos = response?.data || [];

  if (isLoading) return <div>Loading photos...</div>;
  if (isError) return <div>Error: {error?.message}</div>;


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
      {photos.map((photo: PhotoDocument) => (
        <PhotoCard
          key={photo._id}
          photoId={photo._id}
          title={photo.title}
          description={photo.description}
          imageUrl={photo.photo_url}
          uploader={photo.user_id.username}
          averageRating={averageRating}
          tags={photo.tags || []}
          initialLikes={photo.likes || 0}
          profileImgUrl={photo.user_id.profile_img_url}
          created_at={photo.user_id.created_at}
        />
      ))}
    </div>
  );
}
