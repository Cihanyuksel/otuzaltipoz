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
        className="relative w-full"
        style={{
          aspectRatio: dimensions ? `${dimensions.width} / ${dimensions.height}` : '16 / 9',
          maxHeight: '80vh',
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
          sizes="(max-width: 767px) 100vw, (max-width: 822px) min(100%, 774px), (max-height: 756px) min(100%, 774px), (min-aspect-ratio: 4000/3000) calc(calc(100vh - 175px) * 1.3333333333333333), calc(100vw - 48px)"
        />
      </div>
    </div>
  );
}
