'use client';
import { useState, useRef } from 'react';
import { User } from 'types/auth';
import { useOutsideClick } from '@/hooks/ui/useOutsideClick';
import { Header, TabButton, UsernameTab, PasswordTab, ProfileTab } from './index';
import { useProfileModalForms } from './useProfileModalForms';
import { ModalOverlay } from '@/components/common/modal-overlay';

interface IEditProfileModal {
  isOpen: boolean;
  onEditClose: () => void;
  profileOwner: User;
}

type TabType = 'profile' | 'username' | 'password';

const EditProfileModal = ({ isOpen, onEditClose, profileOwner }: IEditProfileModal) => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const modalRef = useRef<HTMLDivElement>(null);

  const { isPending, canChangeUsername, handleCloseAndReset, profileForm, usernameForm, passwordForm } =
    useProfileModalForms({ profileOwner, onEditClose });

  useOutsideClick(modalRef, handleCloseAndReset, isOpen && !isPending);

  if (!isOpen) return null;

  const tabs: { key: TabType; label: string }[] = [
    { key: 'profile', label: 'Profil' },
    { key: 'username', label: 'Kullanıcı Adı' },
    { key: 'password', label: 'Şifre' },
  ];

  return (
    <ModalOverlay onClose={handleCloseAndReset} isLoading={isPending}>
      <div ref={modalRef} className="w-full max-w-lg bg-white rounded-lg shadow-xl transform transition-all">
        <Header handleCloseAndReset={handleCloseAndReset} isPending={isPending} />
        <TabButton tabs={tabs} setActiveTab={setActiveTab} activeTab={activeTab} isPending={isPending} />

        <div className="p-6">
          {activeTab === 'profile' && (
            <ProfileTab profileOwner={profileOwner} form={profileForm} isPending={isPending} handleClose={handleCloseAndReset} />
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
      </div>
    </ModalOverlay>
  );
};

export default EditProfileModal;
