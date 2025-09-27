'use client';
//nextjs and react
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
//project-files
import { useAuth } from '@/context/AuthContext';
import { useGetUserPhotos, useGetLikedPhotos } from '@/hooks/usePhotoApi';
import { useGetUser } from '@/hooks/useAuthApi';
import Loader from '@/components/common/loader';
import UserProfile from './UserProfile';

const UserProfileContainer = () => {
  const { user: currentUser } = useAuth();
  const params = useParams();
  const userId = params?.id as string | undefined;

  const profileOwnerId = userId || currentUser?.id;
  const isOwner = !userId || currentUser?.id === userId;

  const [activeTab, setActiveTab] = useState<'uploaded' | 'liked'>('uploaded');

  useEffect(() => {
    const storageKey = isOwner ? 'activeTab_owner' : `activeTab_${userId}`;
    const savedTab = localStorage.getItem(storageKey) as 'uploaded' | 'liked';
    if (savedTab) {
      setActiveTab(savedTab);
    } else {
      setActiveTab('uploaded');
    }
  }, [userId, isOwner]);

  const handleTabChange = (tab: 'uploaded' | 'liked') => {
    setActiveTab(tab);
    const storageKey = isOwner ? 'activeTab_owner' : `activeTab_${userId}`;
    localStorage.setItem(storageKey, tab);
  };

  const { data: profileOwnerData, isLoading: isUserLoading, isError: isUserError } = useGetUser(profileOwnerId as string);
  const { data: uploadedData, isLoading: isUploadedLoading, isError: isUploadedError } = useGetUserPhotos(profileOwnerId as string);
  const { data: likedData, isLoading: isLikedLoading, isError: isLikedError } = useGetLikedPhotos(profileOwnerId as string);

  const isLoading = isUserLoading || (activeTab === 'uploaded' ? isUploadedLoading : isLikedLoading);
  const isError = isUserError || (activeTab === 'uploaded' ? isUploadedError : isLikedError);

  const profileOwner = profileOwnerData;
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
      isLoading={isLoading}
      isError={isError}
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
