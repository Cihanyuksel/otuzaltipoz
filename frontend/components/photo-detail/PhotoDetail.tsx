'use client';
import { notFound } from 'next/navigation';
import { motion, Variants } from 'framer-motion'; 
import LoginModal from '../auth/login-modal';
import EditPhotoModal from './edit-photo-modal/EditPhotoModal';
import DeleteConfirmPhotoModal from '@/common/confirm-modal';
import Loader from '@/common/loader';
import Button from '@/common/button';
import PhotoLikeButton from '../photos/photo-card/PhotoLikeButton';
import CommentSection from '../comments/CommentSection';
import { PhotoImage, PhotoInfo, RatingSection, UploaderInfo, PhotoActions } from '@/components/photo-detail';
import { usePhotoDetail } from './usePhotoDetail';
import { canManage as canManagePhoto } from 'lib/permission';

const pageVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
      when: 'beforeChildren',
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0, 
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

const PhotoDetail = () => {
  const {
    photo,
    isLoading,
    isError,
    likeData,
    ratingsData,
    modalStates,
    isDeleting,
    handleModalToggle,
    handleDelete,
    user,
    accessToken,
    isPending,
    error,
  } = usePhotoDetail();

  if (isDeleting) return <Loader text={'Fotoğraf Siliniyor...'} />;
  if (isLoading) return <Loader text={'Yükleniyor...'} />;
  if (isError || !photo) return notFound();

  const isOwnerPhoto = user?._id === photo.user._id;
  const isLoggedIn = !!accessToken;
  const canDeletePhoto = canManagePhoto(user?.role, isOwnerPhoto);

  const currentLikeCount = likeData?.likeCount ?? photo.likeCount;
  const currentIsLikedByMe = likeData?.isLikedByMe ?? photo.isLikedByMe;

  const currentAverageRating = ratingsData?.averageRating ?? photo.averageRating ?? 0;
  const currentTotalVotes = ratingsData?.totalVotes ?? photo.totalVotes ?? 0;

  const deletConfirmModalMessage = (
    <>
      <strong>{photo.title}</strong> başlıklı fotoğrafı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
    </>
  );

  return (
    <>
      <section
        className="w-full flex justify-center  py-5 bg-neutral-100 text-gray-800 min-h-screen 2xl:min-h-4/5 px-4 md:px-0"
        style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
      >
        <div className="w-full max-w-6xl 2xl:max-w-4/5">
          <motion.div className="bg-white p-10 shadow-sm" variants={pageVariants} initial="hidden" animate="visible">
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
                      averageRating={currentAverageRating}
                      totalVotes={currentTotalVotes}
                      onLoginRequired={() => handleModalToggle('login', true)}
                    />
                    <PhotoLikeButton
                      photoId={photo._id}
                      totalLikes={currentLikeCount}
                      isLikedByMe={currentIsLikedByMe}
                      onLoginRequired={() => handleModalToggle('login', true)}
                    />
                    {canDeletePhoto && <PhotoActions handleModalToggle={handleModalToggle} />}
                  </div>
                ) : (
                  <div className="flex flex-col justify-end items-end gap-5 mt-3 md:mt-5">
                    <div className="flex flex-col items-end justify-center p-4 rounded-xl text-right max-w-full w-full">
                      <p className="text-sm font-medium text-gray-800 mb-3">
                        Bu fotoğrafı oylamak ve beğenmek için aramıza katıl!
                      </p>
                      <Button onClick={() => handleModalToggle('login', true)} variant="primary" className="w-full">
                        Hemen Giriş Yap
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <CommentSection
                  userPhoto={user?.profile_img_url}
                  photoId={photo._id}
                  onLoginRequired={() => handleModalToggle('login', true)}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <LoginModal isOpen={modalStates.login} onClose={() => handleModalToggle('login', false)} />
      <EditPhotoModal isOpen={modalStates.edit} onClose={() => handleModalToggle('edit', false)} photo={photo} />
      <DeleteConfirmPhotoModal
        isOpen={modalStates.delete}
        onClose={() => handleModalToggle('delete', false)}
        title="Fotoğrafı Sil"
        message={deletConfirmModalMessage}
        onConfirm={handleDelete}
        confirmButtonText={isPending ? 'Siliniyor...' : 'Sil'}
        isConfirming={isPending}
        error={error instanceof Error ? error.message : null}
      />
    </>
  );
};

export default PhotoDetail;
