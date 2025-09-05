'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { FaHeart, FaStar, FaStarHalfAlt, FaRegStar, FaRegHeart } from 'react-icons/fa';
import Link from 'next/link';
import { formatDate } from 'lib/formatDate';

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
  created_at: string;
  onPhotoClick: () => void;
}

const PhotoCard: React.FC<IPhotoCard> = ({
  photoId,
  title,
  description,
  imageUrl,
  uploader,
  profileImgUrl,
  averageRating,
  initialLikes = 0,
  created_at,
  onPhotoClick,
}) => {
  const [likes, setLikes] = useState<number>(initialLikes);
  const [userRating, setUserRating] = useState<number>(0);
  
  return (
    <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200 bg-white hover:shadow-xl transition-shadow duration-300">
      {/* Image */}
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

      {/* Card Body */}
      <div className="p-3 flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2 mt-1">
          <Link href={`/photos/${photoId}`} className="flex-1">
            <div>
              <h2 className="text-sm font-semibold truncate">{title}</h2>
              <p className='truncate'>{description}</p>
            </div>
          </Link>
          
          <Link href={`/biri/${uploader}`} className="flex items-center gap-x-5 p-1 rounded-xl">
            <div className="flex flex-col items-start">
              <p className="text-xs text-gray-800 truncate leading-6">
                Uploaded by: <strong>{uploader}</strong>
              </p>
              <p className="text-xs text-gray-500">{formatDate(created_at)}</p>
            </div>
            <div className="flex items-center w-full">
              <Image
                src={profileImgUrl ? profileImgUrl : '/no_profile.png'}
                alt={`${uploader} profil`}
                width={45}
                height={45}
                className="w-[45px] h-[45px] rounded-full object-cover self-center"
              />
            </div>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-2 p-3">
        <span className="text-gray-500 text-sm font-bold">Average Rating: {averageRating.toFixed(1)}</span>
        
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setLikes((prev) => (prev > 0 ? 0 : prev + 1));
          }}
          className="flex items-center gap-1 text-sm cursor-pointer"
        >
          {likes > 0 ? (
            <FaHeart className="text-[#ef7464] hover:text-[#ef7464cd]" />
          ) : (
            <FaRegHeart className="text-gray-400 hover:text-[#ef7464d1]" />
          )}
          <span >{likes}</span>
        </button>
      </div>
    </div>
  );
};

export default PhotoCard;