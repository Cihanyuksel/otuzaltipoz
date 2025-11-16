'use client';
//nextjs and react
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // BUNU EKLEYİN
//third-party
import { AnimatePresence, motion } from 'framer-motion';
import { FaTimes as CloseIcon } from 'react-icons/fa';
import { CgProfile as ProfileIcon } from 'react-icons/cg';
import { FaCrown as CrownIcon } from 'react-icons/fa6';
//project-files
import { useGetLikes } from '@/hooks/api/useLikeApi';
import { isAdmin } from 'lib/permission';
import { useAuth } from '@/context/AuthContext';
import { ILikedByUser } from 'types/auth';

interface IPhotoLikedUsers {
  photoId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function LikedUsersModal({ photoId, isOpen, onClose }: IPhotoLikedUsers) {
  const { accessToken } = useAuth();
  const router = useRouter();

  const { data, isLoading, isFetching } = useGetLikes(photoId, accessToken, {
    enabled: isOpen && !!accessToken,
  });

  const usersWhoLiked = data?.usersWhoLiked || [];
  const likeCount = data?.likeCount || 0;

  const modalVariants = {
    initial: { scale: 0.8, opacity: 0, y: 10 },
    animate: { scale: 1, opacity: 1, y: 0 },
    exit: { scale: 0.8, opacity: 0, y: 10 },
  };

  const handleUserClick = (e: React.MouseEvent<HTMLButtonElement>, userId: string) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/biri/${userId}`);
    onClose();
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
          <div
            className="bg-white rounded-lg p-4 shadow-xl w-96 max-h-[250px] overflow-y-auto relative border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-sm font-bold mb-2 pr-6">Beğenen Kullanıcılar ({likeCount})</h4>
            <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
              <CloseIcon />
            </button>
            <ul className="space-y-2">
              {isLoading || isFetching ? (
                <p className="text-xs text-gray-500">Beğenenler yükleniyor...</p>
              ) : usersWhoLiked.length > 0 ? (
                usersWhoLiked.map((user: ILikedByUser) => (
                  <li key={user._id}>
                    <button
                      onMouseDown={(e) => handleUserClick(e, user._id)}
                      className="flex items-center gap-2 w-full text-left cursor-pointer"
                    >
                      <div className="relative w-8 h-8 rounded-full flex-shrink-0">
                        {user.profile_img_url ? (
                          <Image
                            src={user.profile_img_url}
                            alt={user.username}
                            fill
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <ProfileIcon className="w-full h-full text-gray-400 rounded-full" />
                        )}
                      </div>
                      <span className="text-sm font-medium truncate">{user.username}</span>
                      <span className="text-[#ef7464]"> {isAdmin(user) && <CrownIcon />}</span>
                    </button>
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
