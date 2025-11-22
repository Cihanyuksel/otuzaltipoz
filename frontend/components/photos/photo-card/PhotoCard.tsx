import PhotoInteractionSection from './PhotoInteractionSection';
import PhotoCardInfo from './PhotoCardInfo';
import PhotoCardImage from './PhotoCardImage';
import { Photo } from 'types/photo';
import PhotoAIAnalyzer from '@/components/photos/photo-card/photo-ai-analyze/PhotoAiAnalyze';

interface IPhotoCard {
  photoId: string;
  title: string;
  description: string;
  imageUrl: string;
  uploader: string;
  profileImgUrl?: string;
  tags: string[];
  initialLikes?: number;
  isLikedByMe?: boolean;
  created_at: Date;
  onPhotoClick: () => void;
  likes?: number;
  uploaderId: string;
  index: number;
  photo: Photo;
}

const PhotoCard = ({
  photoId,
  title,
  description,
  imageUrl,
  uploader,
  profileImgUrl,
  created_at,
  onPhotoClick,
  uploaderId,
  index,
  photo,
}: IPhotoCard) => {
  return (
    <div className="rounded overflow-hidden shadow-lg border transition-all duration-300 border-gray-200 hover:scale-[1.01] hover:shadow-xl bg-white">
      <div className="relative group w-full h-auto overflow-hidden">
        <PhotoCardImage imageUrl={imageUrl} onPhotoClick={onPhotoClick} title={title} index={index} />
        <PhotoAIAnalyzer photoUrl={imageUrl} />
      </div>
      <PhotoCardInfo
        description={description}
        uploader={uploader}
        profileImgUrl={profileImgUrl}
        created_at={created_at}
        photoId={photoId}
        title={title}
        uploaderId={uploaderId}
      />
      <PhotoInteractionSection photo={photo} photoId={photoId} />
    </div>
  );
};

export default PhotoCard;
