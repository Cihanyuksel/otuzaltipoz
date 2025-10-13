'use client';

import useOutsideClick from '@/hooks/ui/useOutsideClick';
import { Dispatch, SetStateAction, useRef, JSX } from 'react';
import {
  MdPerson as ProfileIcon,
  MdPhoto as PhotoIcon,
  MdMessage as MessageIcon,
  MdNotifications as NotificationsIcon,
  MdKeyboardArrowDown as ArrowDownIcon,
} from 'react-icons/md';
import { User } from 'types/auth';

interface IUserSection {
  setDropdownOpen: Dispatch<SetStateAction<boolean>>;
  handleDropdown: () => void;
  user: User | null;
  loading: boolean;
  dropdownOpen: boolean;
  handleLogout: () => void;
  isLogoutPending: boolean;
}

interface DropdownItem {
  name: string;
  href: string;
  icon: JSX.Element;
  isButton?: boolean;
  onClick?: () => void;
  badgeCount?: number;
  disabled?: boolean;
}

function UserSection({
  setDropdownOpen,
  handleDropdown,
  user,
  loading,
  dropdownOpen,
  handleLogout,
  isLogoutPending,
}: IUserSection) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOutsideClick(dropdownRef, () => setDropdownOpen(false), dropdownOpen);

  const dropdownItems: DropdownItem[] = [
    { name: 'Profil', href: '/profile', icon: <ProfileIcon size={20} /> },
    { name: 'Fotoğraf Yükle', href: '/photo-upload', icon: <PhotoIcon size={20} /> },
    { name: 'Mesajlar', href: '/messages', icon: <MessageIcon size={20} /> },
    { name: 'Bildirimler', href: '/notifications', icon: <NotificationsIcon size={20} />, badgeCount: 1 },
    {
      name: 'Çıkış Yap',
      href: '/',
      icon: <ProfileIcon size={20} />,
      onClick: handleLogout,
      isButton: true,
      disabled: isLogoutPending,
    },
  ];

  if (!user) {
    return !loading ? (
      <div className="hidden lg:flex space-x-5 flex-shrink-0">
        <li className="list-none w-28">
          <a
            href="/login"
            className="px-4 py-1 font-semibold border border-[#d3deda] rounded hover:bg-[#d3deda] hover:text-white hover:font-semibold hover:border-white transition cursor-pointer"
          >
            Giriş Yap
          </a>
        </li>
        <li className="list-none w-28">
          <a
            href="/register"
            className="px-4 py-1 font-semibold border border-[#d3deda] rounded hover:bg-[#d3deda] hover:text-white hover:font-semibold hover:border-white transition cursor-pointer"
          >
            Kayıt Ol
          </a>
        </li>
      </div>
    ) : null;
  }

  return (
    <div ref={dropdownRef} className="relative flex items-center gap-4 flex-shrink-0">
      <div className="flex items-center gap-4">
        <img
          src={user.profile_img_url || '/no_profile.png'}
          alt="Profile Picture"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="hidden xl:flex flex-col text-sm">
          <span className="font-bold text-gray-800 text-base">{user.username}</span>
          <span className="text-xs text-gray-500">{user.role === 'user' ? 'User' : 'Admin'}</span>
        </div>
      </div>

      <button
        onClick={handleDropdown}
        className="p-1 rounded-full hover:bg-gray-200 transition-all focus:outline-none cursor-pointer"
      >
        <ArrowDownIcon
          size={24}
          className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : 'rotate-0'}`}
        />
      </button>

      <div
        className={`absolute right-0 top-full mt-2 w-52 bg-white border border-gray-200 rounded-md shadow-lg z-50 
          transition-all duration-200 origin-top
          ${dropdownOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}
      >
        <ul className="py-1">
          {dropdownItems.map((item) =>
            item.isButton ? (
              <li key={item.name} className="border-t border-gray-200 mt-1 pt-1">
                <button
                  onClick={item.onClick}
                  disabled={item.disabled}
                  className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {item.disabled ? 'Çıkış Yapılıyor...' : item.name}
                </button>
              </li>
            ) : (
              <li key={item.name} className="relative">
                <a
                  href={item.href}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#d3deda]">
                    {item.icon}
                  </span>
                  {item.name}
                  {item.badgeCount && (
                    <span className="absolute top-1/2 -translate-y-1/2 right-4 inline-flex items-center justify-center h-4 w-4 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                      {item.badgeCount}
                    </span>
                  )}
                </a>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
}

export default UserSection;
