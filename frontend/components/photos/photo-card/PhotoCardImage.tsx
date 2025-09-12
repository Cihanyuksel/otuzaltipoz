import Image from 'next/image';

interface IPhotoCardImage {
  title: string;
  imageUrl: string;
  onPhotoClick: () => void;
}

function PhotoCardImage({ imageUrl, onPhotoClick, title }: IPhotoCardImage) {
  return (
    <div onClick={onPhotoClick} className="block cursor-pointer">
      <div className="relative w-full h-64 sm:h-72 md:h-80">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-contain bg-gray-100"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
    </div>
  );
}

export default PhotoCardImage;
