import Image from 'next/image';
import { PhotoInfo } from './PhotoInfo';
import { Photo } from 'types/photo';

interface IModalContent {
  photo: Photo;
}

export const ModalContent = ({ photo }: IModalContent) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center group">
      <Image
        src={photo.photo_url}
        alt={photo.title}
        fill
        className="object-contain"
        sizes="(max-width: 768px) 100vw, 80vw"
        priority
      />

      <PhotoInfo photo={photo} />
    </div>
  );
};
