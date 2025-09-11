'use client';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import { formatDate } from 'lib/formatDate';
import { useGetLikes, useToggleLike } from '@/hooks/useLikeApi';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import { CgProfile } from 'react-icons/cg';
import { motion, AnimatePresence } from 'framer-motion';

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
  isLikedByMe?: boolean;
  created_at: string;
  onPhotoClick: () => void;
  likes?: number;
}

const PhotoCard: React.FC<IPhotoCard> = ({
  photoId,
  title,
  description,
  imageUrl,
  uploader,
  profileImgUrl,
  averageRating,
  created_at,
  onPhotoClick,
}) => {
  const { mutateAsync, isPending } = useToggleLike();
  const { accessToken } = useAuth();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const likeButtonRef = useRef<HTMLButtonElement>(null);

  const { data, isLoading: isLikesLoading } = useGetLikes(photoId, accessToken);
  
  const currentIsLikedByMe = data?.isLikedByMe;
  const currentLikeCount = data?.likeCount;
  const usersWhoLiked = data?.usersWhoLiked || [];

  console.log(usersWhoLiked)
  const handleToggleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!accessToken) {
      toast.info('Giriş yapmalısınız.');
      return;
    }

    try {
      await mutateAsync({ photoId, accessToken });
    } catch (err) {
      console.error(err);
    }
  };

  const hearthIcon = isLikesLoading ? (
    <div className="w-4 h-4 bg-gray-200" />
  ) : currentIsLikedByMe ? (
    <FaHeart className="text-[#ef7464]" />
  ) : (
    <FaRegHeart className="text-gray-400" />
  );

  const openModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Eğer tıklama modalın dışındaki bir yere yapıldıysa
      if (likeButtonRef.current && !likeButtonRef.current.contains(event.target as Node)) {
        closeModal();
      }
    };
    if (isModalOpen) {
      // Modalı açtığımızda global tıklama dinleyicisini ekle
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      // Modal kapandığında dinleyiciyi kaldır
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  const modalVariants = {
    initial: { scale: 0.8, opacity: 0, y: 10 },
    animate: { scale: 1, opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } },
    exit: { scale: 0.8, opacity: 0, y: 10 },
  };

  return (
    <div className="rounded overflow-hidden shadow-lg border border-gray-200 bg-white hover:shadow-xl transition-shadow duration-300">
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
      <div className="p-3 flex flex-col gap-1 bg-[#f5f1ea]">
        <div className="flex items-center justify-between gap-2 mt-1">
          <Link href={`/photos/${photoId}`} className="flex-1 min-w-0">
            <div>
              <h2 className="text-sm font-semibold truncate">{title}</h2>
              <p className="truncate">{description}</p>
            </div>
          </Link>

          <Link href={`/biri/${uploader}`} className="flex items-center gap-x-5 p-1 rounded-xl">
            <div className="flex flex-col items-end">
              <p className="text-xs text-gray-800 truncate leading-6">
                Uploaded by: <strong>{uploader}</strong>
              </p>
              <p className="text-xs text-gray-500">{formatDate(created_at)}</p>
            </div>
            <div className="flex items-center">
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

        <div className="flex items-center gap-2 relative">
            {accessToken && (
                <div className="flex items-center">
                    <button
                        onClick={handleToggleLike}
                        className="flex items-center gap-1 text-sm cursor-pointer disabled:opacity-50"
                        disabled={isPending || isLikesLoading}
                        aria-label={currentIsLikedByMe ? 'Beğeni kaldır (Unlike)' : 'Beğen (Like)'}
                    >
                        {hearthIcon}
                    </button>
                    {currentLikeCount > 0 && (
                        <button 
                            ref={likeButtonRef}
                            onClick={openModal} 
                            className="text-sm font-semibold cursor-pointer text-gray-700 hover:underline"
                        >
                            {currentLikeCount} Beğeni
                        </button>
                    )}
                </div>
            )}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div 
                        className="absolute bottom-full mb-2 right-0 z-50 transform translate-x-1/2"
                        variants={modalVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <div 
                            className="bg-white rounded-lg p-4 shadow-xl w-96 max-h-[250px] overflow-y-auto relative border border-gray-200"
                        >
                            <h4 className="text-sm font-bold mb-2 pr-6">Beğenen Kullanıcılar ({currentLikeCount})</h4>
                            <button
                                onClick={closeModal}
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                                aria-label="Modali Kapat"
                            >
                                <FaTimes />
                            </button>
                            
                            <ul className="space-y-2">
                                {usersWhoLiked.length > 0 ? (
                                    usersWhoLiked.map((user: any) => (
                                        <li key={user._id}>
                                            <Link href={`/biri/${user._id}`} className="flex items-center gap-2" onClick={closeModal}>
                                                <div className="relative w-8 h-8 rounded-full flex-shrink-0">
                                                    {user.profile_img_url ? (
                                                        <Image
                                                            src={user?.profile_img_url}
                                                            alt={user.username}
                                                            fill
                                                            className="rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <CgProfile className="w-full h-full text-gray-400 rounded-full" />
                                                    )}
                                                </div>
                                                <span className="text-sm font-medium truncate">{user.username}</span>
                                            </Link>
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-xs text-gray-500">Henüz beğeni yok.</p>
                                )}
                            </ul>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;