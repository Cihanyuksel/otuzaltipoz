import Image from 'next/image';

interface IPhotoCardImage {
  title: string;
  imageUrl: string;
  onPhotoClick: () => void;
  index: number;
}

function PhotoCardImage({ imageUrl, onPhotoClick, title, index }: IPhotoCardImage) {
  return (
    <div onClick={onPhotoClick} className="block cursor-pointer">
      <div className="relative w-full h-64 sm:h-72 md:h-80">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, 
          (max-width: 1280px) 50vw,
          (max-width: 1536px) 33vw,
          25vw"
          className="object-contain bg-gray-100"
          loading={index < 10 ? 'eager' : 'lazy'}
          priority={index < 10}
        />
      </div>
    </div>
  );
}

export default PhotoCardImage;
