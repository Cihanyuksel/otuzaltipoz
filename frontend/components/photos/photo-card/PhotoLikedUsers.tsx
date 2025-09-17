'use client';
//nextjs and react
import Image from 'next/image';
import Link from 'next/link';
//third-party
import { AnimatePresence, motion } from 'framer-motion';
import { FaTimes as CloseIcon } from 'react-icons/fa';
import { CgProfile as ProfileIcon } from 'react-icons/cg';
//project-files
import { useGetLikes } from '@/hooks/useLikeApi';
import { useAuth } from '@/context/AuthContext';

interface PhotoLikedUsersProps {
  photoId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function PhotoLikedUsers({ photoId, isOpen, onClose }: PhotoLikedUsersProps) {
  const { accessToken } = useAuth();

  const { data, isLoading, isFetching } = useGetLikes(photoId, accessToken, {
    enabled: isOpen,
  });

  const usersWhoLiked = data?.usersWhoLiked || [];
  const likeCount = data?.likeCount || 0;

  const modalVariants = {
    initial: { scale: 0.8, opacity: 0, y: 10 },
    animate: { scale: 1, opacity: 1, y: 0 },
    exit: { scale: 0.8, opacity: 0, y: 10 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute bottom-full mb-2 right-0 z-50 transform translate-x-1/2"
          variants={modalVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <div className="bg-white rounded-lg p-4 shadow-xl w-96 max-h-[250px] overflow-y-auto relative border border-gray-200">
            <h4 className="text-sm font-bold mb-2 pr-6">Beğenen Kullanıcılar ({likeCount})</h4>
            <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
              <CloseIcon />
            </button>
            <ul className="space-y-2">
              {isLoading || isFetching ? (
                <p className="text-xs text-gray-500">Beğenenler yükleniyor...</p>
              ) : usersWhoLiked.length > 0 ? (
                usersWhoLiked.map((user: any) => (
                  <li key={user._id}>
                    <Link href={`/biri/${user._id}`} className="flex items-center gap-2" onClick={onClose}>
                      <div className="relative w-8 h-8 rounded-full flex-shrink-0">
                        {user.profile_img_url ? (
                          <Image src={user.profile_img_url} alt={user.username} fill className="rounded-full object-cover" />
                        ) : (
                          <ProfileIcon className="w-full h-full text-gray-400 rounded-full" />
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
  );
}
