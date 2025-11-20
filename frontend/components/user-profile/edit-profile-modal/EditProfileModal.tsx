'use client';
import { useState } from 'react';
import { User } from 'types/auth';
import { TabButton, UsernameTab, PasswordTab, ProfileTab } from './index';
import { useProfileModalForms } from './useProfileModalForms';
import ModalOverlay from '@/components/common/modal-overlay';
import ModalHeader from '@/components/common/modal-header';
import ModalContent from '@/components/common/modal-content';

interface IEditProfileModal {
  isOpen: boolean;
  onEditClose: () => void;
  profileOwner: User;
}

type TabType = 'profile' | 'username' | 'password';

const EditProfileModal = ({ isOpen, onEditClose, profileOwner }: IEditProfileModal) => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  const { isPending, canChangeUsername, handleCloseAndReset, profileForm, usernameForm, passwordForm } =
    useProfileModalForms({ profileOwner, onEditClose });

  const tabs: { key: TabType; label: string }[] = [
    { key: 'profile', label: 'Profil' },
    { key: 'username', label: 'Kullanıcı Adı' },
    { key: 'password', label: 'Şifre' },
  ];

  return (
    <ModalOverlay isModalVisible={isOpen} onClose={handleCloseAndReset} isLoading={isPending}>
      <ModalContent isOpen={isOpen} className="bg-white rounded-lg">
        <ModalHeader onClose={handleCloseAndReset} isLoading={isPending} title="Profili Düzenle" />
        <TabButton tabs={tabs} setActiveTab={setActiveTab} activeTab={activeTab} isPending={isPending} />
        <div className="p-6">
          {activeTab === 'profile' && (
            <ProfileTab
              profileOwner={profileOwner}
              form={profileForm}
              isPending={isPending}
              handleClose={handleCloseAndReset}
            />
          )}
          {activeTab === 'username' && (
            <UsernameTab
              form={usernameForm}
              isPending={isPending}
              canChangeUsername={canChangeUsername}
              userUsername={profileOwner.username}
              handleClose={handleCloseAndReset}
            />
          )}
          {activeTab === 'password' && (
            <PasswordTab form={passwordForm} isPending={isPending} handleClose={handleCloseAndReset} />
          )}
        </div>
      </ModalContent>
    </ModalOverlay>
  );
};

export default EditProfileModal;
