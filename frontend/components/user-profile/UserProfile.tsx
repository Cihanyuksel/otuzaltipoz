//project-files
import ProfileHeader from './ProfileHeader';
import ProfileTabs from './ProfileTabs';
import PhotoGallery from './PhotoGallery';
import Loader from '@/components/common/loader';
//types
import { User } from 'types/auth';
import { Photo } from 'types/photo';

interface IUserProfile {
  isLoading: boolean;
  isError: boolean;
  profileOwner: User;
  imageUrl: string;
  isOwner: boolean;
  activeTab: 'uploaded' | 'liked';
  handleTabChange: (tab: 'uploaded' | 'liked') => void;
  photosToShow: Photo[];
}

const UserProfile = ({isLoading, isError, profileOwner, imageUrl, isOwner, photosToShow, activeTab, handleTabChange }: IUserProfile) => {
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isError || !profileOwner) {
    return (
      <section className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">Kullanıcı bulunamadı</p>
          <p className="text-gray-600 mt-2">Bu kullanıcı mevcut değil.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex-1 min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <ProfileHeader user={profileOwner} imageUrl={imageUrl} isOwner={isOwner} />
        <div className="mt-12">
          <ProfileTabs activeTab={activeTab} handleTabChange={handleTabChange} />
          <PhotoGallery photosToShow={photosToShow} isOwner={isOwner} />
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
