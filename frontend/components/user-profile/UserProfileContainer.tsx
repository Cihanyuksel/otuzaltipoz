'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useGetUserPhotos, useGetLikedPhotos } from '@/hooks/api/usePhotoApi';
import { useGetUser } from '@/hooks/api/useAuthApi';
import Loader from '@/components/common/loader';
import UserProfile from './UserProfile';

interface IUserProfileContainerProps {
  userId?: string;
}

const UserProfileContainer = ({ userId: userIdFromServer }: IUserProfileContainerProps) => {
  const { user: currentUser } = useAuth();
  const params = useParams();
  const userIdFromParams = params?.id as string | undefined;

  const profileOwnerId = userIdFromServer || userIdFromParams || currentUser?._id;
  const isOwner = (!userIdFromServer && !userIdFromParams) || currentUser?._id === profileOwnerId;
  const [activeTab, setActiveTab] = useState<'uploaded' | 'liked'>('uploaded');

  useEffect(() => {
    const storageKey = isOwner ? 'activeTab_owner' : `activeTab_${profileOwnerId}`;
    const savedTab = localStorage.getItem(storageKey) as 'uploaded' | 'liked';
    setActiveTab(savedTab || 'uploaded');
  }, [profileOwnerId, isOwner]);

  const handleTabChange = (tab: 'uploaded' | 'liked') => {
    setActiveTab(tab);
    const storageKey = isOwner ? 'activeTab_owner' : `activeTab_${profileOwnerId}`;
    localStorage.setItem(storageKey, tab);
  };

  const { data: profileOwner, isLoading: isUserLoading, isError: isUserError } = useGetUser(profileOwnerId as string);
  const {
    data: uploadedData,
    isLoading: isUploadedLoading,
    isError: isUploadedError,
  } = useGetUserPhotos(profileOwnerId as string);
  const {
    data: likedData,
    isLoading: isLikedLoading,
    isError: isLikedError,
  } = useGetLikedPhotos(profileOwnerId as string);

  const isLoading = isUserLoading || (activeTab === 'uploaded' ? isUploadedLoading : isLikedLoading);
  const isError = isUserError || (activeTab === 'uploaded' ? isUploadedError : isLikedError);
  const imageUrl = profileOwner?.profile_img_url || '/no_profile.png';
  const photosToShow = activeTab === 'uploaded' ? uploadedData?.data || [] : likedData?.data || [];
  
  if (isLoading) return <Loader />;

  if (isError || !profileOwner) {
    return (
      <section className="h-full flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">Kullanıcı bulunamadı</p>
          <p className="text-gray-600 mt-2">Bu kullanıcı mevcut değil.</p>
        </div>
      </section>
    );
  }

  return (
    <UserProfile
      profileOwner={profileOwner}
      imageUrl={imageUrl}
      isOwner={isOwner}
      activeTab={activeTab}
      handleTabChange={handleTabChange}
      photosToShow={photosToShow}
    />
  );
};

export default UserProfileContainer;
