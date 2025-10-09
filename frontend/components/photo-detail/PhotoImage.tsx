"use client"
import Image from "next/image";
import { useState } from "react";

type IPhotoImage = {
  photoUrl: string;
  title: string;
};

export default function PhotoImage({ photoUrl, title }: IPhotoImage) {
  const [src, setSrc] = useState(photoUrl);

  const PHOTO_NOT_FOUND = "/image-not-found.png";

  return (
    <div className="relative h-[300px] md:h-[400px] lg:h-[625px]">
      <Image
        src={src || PHOTO_NOT_FOUND}
        alt={title}
        fill
        className="object-contain object-center"
        priority
        onError={() => setSrc(PHOTO_NOT_FOUND)}
        sizes="(max-width: 767px) 100vw, (max-width: 822px) min(100%, 774px), (max-height: 756px) min(100%, 774px), (min-aspect-ratio: 4000/3000) calc(calc(100vh - 175px) * 1.3333333333333333), calc(100vw - 48px)"
      />
    </div>
  );
}