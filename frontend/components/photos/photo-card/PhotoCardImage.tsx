import Image from 'next/image';

interface IPhotoCardImage {
  title: string;
  imageUrl: string;
  onPhotoClick: () => void;
  index: number
}

function PhotoCardImage({ imageUrl, onPhotoClick, title, index }: IPhotoCardImage) {
  return (
    <div onClick={onPhotoClick} className="block cursor-pointer">
      <div className="relative w-full h-64 sm:h-72 md:h-80">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-contain bg-gray-100"
          priority={index < 10} 
        />
      </div>
    </div>
  );
}

export default PhotoCardImage;
