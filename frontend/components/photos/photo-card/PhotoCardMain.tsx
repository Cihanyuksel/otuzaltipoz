import LikeSection from './LikeSection';
import PhotoCardInfo from './PhotoCardInfo';
import PhotoCardImage from './PhotoCardImage';

interface IPhotoCard {
  photoId: string;
  title: string;
  description: string;
  imageUrl: string;
  uploader: string;
  profileImgUrl?: string;
  averageRating: number;
  tags: string[];
  initialLikes?: number;
  isLikedByMe?: boolean;
  created_at: string;
  onPhotoClick: () => void;
  likes?: number;
  uploaderId: string;
  index: number
}

const PhotoCardMain: React.FC<IPhotoCard> = ({
  photoId,
  title,
  description,
  imageUrl,
  uploader,
  profileImgUrl,
  created_at,
  onPhotoClick,
  uploaderId,
  index
}) => {
  return (
    <div className="rounded overflow-hidden shadow-lg border transition-all duration-300 border-gray-200  hover:scale-101 hover:shadow-xl">
      <PhotoCardImage imageUrl={imageUrl} onPhotoClick={onPhotoClick} title={title} index={index} />
      <PhotoCardInfo
        description={description}
        uploader={uploader}
        profileImgUrl={profileImgUrl}
        created_at={created_at}
        photoId={photoId}
        title={title}
        uploaderId={uploaderId}
      />
      <LikeSection photoId={photoId} />
    </div>
  );
};

export default PhotoCardMain;

