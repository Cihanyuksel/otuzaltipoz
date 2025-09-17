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
    <div className="relative w-full h-[400px] md:h-[600px] lg:h-[750px]">
      <Image
        src={src || PHOTO_NOT_FOUND}
        alt={title}
        fill
        className="object-cover object-center"
        priority
        onError={() => setSrc(PHOTO_NOT_FOUND)}
      />
    </div>
  );
}