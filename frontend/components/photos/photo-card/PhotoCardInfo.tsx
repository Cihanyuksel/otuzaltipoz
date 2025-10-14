import { formatDateNumeric } from 'lib/formatDate';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { HiArrowRight } from 'react-icons/hi2';

interface IPhotoCardInfo {
  photoId: string;
  title: string;
  description: string;
  uploader: string;
  profileImgUrl?: string;
  created_at: string;
  uploaderId: string;
}

function PhotoCardInfo({
  description,
  created_at,
  uploader,
  profileImgUrl,
  photoId,
  title,
  uploaderId,
}: IPhotoCardInfo) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLinkHovered, setIsLinkHovered] = useState(false);

  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="p-3 flex flex-col gap-1 bg-[#f5f1ea]">
      <div className="flex items-center justify-between gap-2 mt-1">
        <Link
          href={`/photos/${photoId}`}
          prefetch={false}
          className="flex-1 min-w-0 group"
          onMouseEnter={() => setIsLinkHovered(true)}
          onMouseLeave={() => setIsLinkHovered(false)}
        >
          <div className="relative">
            <div className="flex items-center gap-1">
              <h2 className="text-sm font-semibold truncate group-hover:text-[#ef7464] transition-colors duration-200">
                {title}
              </h2>
              <HiArrowRight
                className={`text-[#ef7464] flex-shrink-0 transition-all duration-200 font-bold ${
                  isLinkHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                }`}
                size={12}
                strokeWidth={1}
              />
            </div>
            <p className="truncate text-gray-600 group-hover:text-gray-800 transition-colors duration-200">
              {description}
            </p>
          </div>
        </Link>

        <Link
          href={`/biri/${uploaderId}`}
          prefetch={false}
          className="flex items-center gap-x-5 p-1 rounded-xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex flex-col items-end">
            <p className="text-xs text-gray-800 truncate leading-6">
              Yükleyen: <strong>{uploader}</strong>
            </p>
            <p className="text-xs text-gray-500">{formatDateNumeric(created_at)}</p>
          </div>
          <div className="flex items-center relative w-[45px] h-[45px]">
            <Image
              src={profileImgUrl ? profileImgUrl : '/no_profile.png'}
              alt={`${uploader} profil`}
              width={45}
              height={45}
              className={`w-[45px] h-[45px] rounded-full object-cover absolute inset-0 transition-opacity duration-300 ${
                isHovered ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <div
              className={`w-[45px] h-[45px] rounded-full bg-[#ef7464] flex items-center justify-center text-white font-bold text-xl absolute inset-0 transition-opacity duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {getInitial(uploader)}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default PhotoCardInfo;
