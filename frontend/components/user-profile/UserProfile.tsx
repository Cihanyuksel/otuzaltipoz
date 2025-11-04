'use client';
import { useState } from 'react';
import { ProfileHeader, ProfileTabs, PhotoGallery, EditProfileModal } from './index';
import { User } from 'types/auth';
import { Photo } from 'types/photo';

interface IUserProfile {
  profileOwner: User;
  imageUrl: string;
  isOwner: boolean;
  activeTab: 'uploaded' | 'liked';
  handleTabChange: (tab: 'uploaded' | 'liked') => void;
  photosToShow: Photo[];
}

const UserProfile = ({ profileOwner, imageUrl, isOwner, photosToShow, activeTab, handleTabChange }: IUserProfile) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <>
      <section className="flex-1 min-h-screen">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <ProfileHeader
            user={profileOwner}
            imageUrl={imageUrl}
            isOwner={isOwner}
            onEditProfileClick={() => setIsEditModalOpen(true)}
          />
          <ProfileTabs activeTab={activeTab} handleTabChange={handleTabChange} />
          <PhotoGallery photosToShow={photosToShow} isOwner={isOwner} activeTab={activeTab} />
        </div>
      </section>
      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} user={profileOwner} />
    </>
  );
};

export default UserProfile;
