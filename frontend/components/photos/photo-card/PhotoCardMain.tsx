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
  uploaderId:string;
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
  uploaderId
}) => {
  return (
    <div className="rounded overflow-hidden shadow-lg border border-gray-200 bg-white hover:shadow-xl transition-shadow duration-300">
      <PhotoCardImage imageUrl={imageUrl} onPhotoClick={onPhotoClick} title={title} />
      <PhotoCardInfo
        description={description}
        uploader={uploader}
        profileImgUrl={profileImgUrl}
        created_at={created_at}
        photoId={photoId}
        title={title}
        uploaderId={uploaderId}
      />
      <LikeSection photoId={photoId}/>
    </div>
  );
};

export default PhotoCardMain;
