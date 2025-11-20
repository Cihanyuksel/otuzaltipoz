'use client';
import { motion, Variants } from 'framer-motion';
import LoginModal from '../auth/login-modal';
import EditPhotoModal from './edit-photo-modal/EditPhotoModal';
import DeletePhotoConfirmModal from '@/common/confirm-modal';
import Button from '@/common/button';
import PhotoLikeButton from '../photos/photo-card/PhotoLikeButton';
import CommentSection from '../comments/CommentSection';
import { PhotoImage, PhotoInfo, RatingSection, UploaderInfo, PhotoActions } from '@/components/photo-detail';
import { User } from 'types/auth';
import { Photo } from 'types/photo';

const pageVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeInOut', when: 'beforeChildren', staggerChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

interface IPhotoDetailView {
  photo: Photo;
  user: User | null;
  isLoggedIn: boolean;
  stats: {
    likeCount: number;
    isLikedByMe: boolean;
    averageRating: number;
    totalVotes: number;
  };
  permissions: {
    canDelete: boolean;
  };
  modals: {
    login: boolean;
    edit: boolean;
    delete: boolean;
    isPending: boolean;
    error: Error | null | unknown;
    deleteMessage: React.ReactNode;
  };
  handlers: {
    onModalToggle: (modal: 'login' | 'edit' | 'delete', isOpen: boolean) => void;
    onDeleteConfirm: () => void;
  };
  accessToken: string | null;
}

const PhotoDetailView = ({
  photo,
  user,
  isLoggedIn,
  stats,
  permissions,
  modals,
  handlers,
  accessToken,
}: IPhotoDetailView) => {
  return (
    <>
      <section
        className="w-full flex justify-center md:py-5 bg-neutral-100 text-gray-800 min-h-screen 2xl:min-h-4/5"
        style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
      >
        <div className="w-full max-w-6xl 2xl:max-w-4/5">
          <motion.div className="bg-gray-50 p-3 shadow-sm" variants={pageVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants}>
              <PhotoImage photoUrl={photo.photo_url} title={photo.title} />
            </motion.div>

            <div className="flex flex-col justify-between w-full mt-5 md:pt-5 md:px-10">
              <motion.div className="grid grid-cols-1 gap-4 md:gap-8 md:grid-cols-3" variants={itemVariants}>
                <div className="md:col-span-2">
                  <PhotoInfo title={photo.title} description={photo.description} tags={photo.tags} />
                  <UploaderInfo user={photo.user} photoCreatedAt={photo.created_at} photoUpdatedAt={photo.updated_at} />
                  <div className="mt-4"></div>
                </div>

                {isLoggedIn ? (
                  <div className="flex flex-col justify-between md:flex-col items-end gap-2">
                    <RatingSection
                      photoId={photo._id}
                      accessToken={accessToken}
                      averageRating={stats.averageRating}
                      totalVotes={stats.totalVotes}
                      onLoginRequired={() => handlers.onModalToggle('login', true)}
                    />
                    <PhotoLikeButton
                      photoId={photo._id}
                      totalLikes={stats.likeCount}
                      isLikedByMe={stats.isLikedByMe}
                      onLoginRequired={() => handlers.onModalToggle('login', true)}
                    />
                    {permissions.canDelete && <PhotoActions handleModalToggle={handlers.onModalToggle} />}
                  </div>
                ) : (
                  <div className="flex flex-col justify-center rounded-xl max-w-full w-full">
                    <p className="text-sm font-medium text-gray-800 mb-3 break-words whitespace-normal text-center">
                      Bu fotoğrafı oylamak ve beğenmek için aramıza katıl!
                    </p>
                    <Button onClick={() => handlers.onModalToggle('login', true)} variant="primary" className="w-full">
                      Giriş Yap
                    </Button>
                  </div>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <CommentSection
                  userPhoto={user?.profile_img_url}
                  photoId={photo._id}
                  onLoginRequired={() => handlers.onModalToggle('login', true)}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <LoginModal isOpen={modals.login} onClose={() => handlers.onModalToggle('login', false)} />
      <EditPhotoModal isOpen={modals.edit} onClose={() => handlers.onModalToggle('edit', false)} photo={photo} />
      <DeletePhotoConfirmModal
        isOpen={modals.delete}
        onClose={() => handlers.onModalToggle('delete', false)}
        title="Fotoğrafı Sil"
        message={modals.deleteMessage}
        onConfirm={handlers.onDeleteConfirm}
        confirmButtonText={modals.isPending ? 'Siliniyor...' : 'Sil'}
        isConfirming={modals.isPending}
        error={modals.error instanceof Error ? modals.error.message : null}
      />
    </>
  );
};

export default PhotoDetailView;
