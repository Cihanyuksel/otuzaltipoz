'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { FaHeart, FaStar, FaStarHalfAlt, FaRegStar, FaRegHeart } from 'react-icons/fa';
import { formatDate } from '../lib/formatDate';
import Link from 'next/link';

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
}) => {
  const [likes, setLikes] = useState<number>(initialLikes);
  const [userRating, setUserRating] = useState<number>(0);

  return (
    <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200 bg-white hover:shadow-xl transition-shadow duration-300">
      {/* Photo */}
      <Link key={photoId} href={`/photos/${photoId}`} className="block">
        <div className="relative w-full h-64 sm:h-72 md:h-80">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-contain bg-gray-100"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-3 flex flex-col gap-1">
        <Link href="/users/profile" className="flex items-center justify-between gap-2 mt-1">
          <div>
            <h2 className="text-sm font-semibold truncate">{title}</h2>
            <p>{description}</p>
          </div>
          <div className="flex items-center gap-x-5  p-1 rounded-xl">
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
          </div>
        </Link>

        {/* Tags }
        <div className="flex flex-wrap gap-1 mt-1">
          {tags.map((tag) => (
            <span key={tag} className="text-gray-500 text-[10px] bg-gray-100 px-2 py-0.5 rounded">
              #{tag}
            </span>
          ))}
        </div>
        {/* Tags }

        {/* Footer */}
        <div className="flex justify-between items-center mt-2">
          <span className="text-gray-500 text-sm font-bold">Average Rating: {averageRating.toFixed(1)}</span>

          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, index) => {
              const ratingValue = index + 1;
              return (
                <span
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    setUserRating(ratingValue);
                  }}
                  className="cursor-pointer"
                >
                  {userRating >= ratingValue ? (
                    ratingValue % 1 === 0 ? (
                      <FaStar className="text-yellow-500" />
                    ) : (
                      <FaStarHalfAlt className="text-yellow-500" />
                    )
                  ) : (
                    <FaRegStar className="text-yellow-500" />
                  )}
                </span>
              );
            })}
            <span className="text-sm ml-1">{userRating > 0 ? userRating : ''}</span>
          </div>

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
            {likes > 0 && <span>{likes}</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;
