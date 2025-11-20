'use client';
import Image from 'next/image';
import { useState } from 'react';

type IPhotoImage = {
  photoUrl: string;
  title: string;
};

export default function PhotoImage({ photoUrl, title }: IPhotoImage) {
  const [src, setSrc] = useState(photoUrl);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  const PHOTO_NOT_FOUND = '/image-not-found.png';

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight,
    });
  };

  return (
    <div className="relative w-full 2xl:max-w-7xl mx-auto">
      <div
        className="relative w-full max-h-[100vh] md:max-h-[80vh]"
        style={{
          aspectRatio: dimensions ? `${dimensions.width} / ${dimensions.height}` : '16 / 9',
        }}
      >
        <Image
          src={src || PHOTO_NOT_FOUND}
          alt={title}
          fill
          className="object-contain"
          priority
          onError={() => setSrc(PHOTO_NOT_FOUND)}
          onLoad={handleImageLoad}
          sizes="(max-width: 767px) 100vw, (max-width: 1200px) 80vw, 1200px"
        />
      </div>
    </div>
  );
}
