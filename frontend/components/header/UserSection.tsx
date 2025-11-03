'use client';
//nextjs and react
import { Dispatch, SetStateAction, useRef, useCallback, JSX } from 'react';
import Link from 'next/link';
//third-party
import {
  MdPerson as ProfileIcon,
  MdPhoto as PhotoIcon,
  MdMessage as MessageIcon,
  MdNotifications as NotificationsIcon,
  MdKeyboardArrowDown as ArrowDownIcon,
} from 'react-icons/md';
import { FiLogIn as LoginIcon, FiUserPlus as RegisterIcon } from 'react-icons/fi';
//project files
import { useOutsideClick } from '@/hooks/ui/useOutsideClick';
import { User } from 'types/auth';

interface IUserSection {
  setDropdownOpen: Dispatch<SetStateAction<boolean>>;
  handleDropdown: () => void;
  user: User | null;
  loading: boolean;
  dropdownOpen: boolean;
  handleLogout: () => void;
  isLogoutPending: boolean;
  isScrolled: boolean;
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
  isScrolled,
}: IUserSection) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const closeDropdown = useCallback(() => {
    setDropdownOpen(false);
  }, [setDropdownOpen]);

  useOutsideClick(dropdownRef, closeDropdown, dropdownOpen);

  const dropdownItems: DropdownItem[] = [
    { name: 'Profil', href: '/profile', icon: <ProfileIcon size={20} /> },
    { name: 'Fotoğraf Yükle', href: '/photo-upload', icon: <PhotoIcon size={20} /> },
    { name: 'Mesajlar', href: '/messages', icon: <MessageIcon size={20} />, disabled: true },
    {
      name: 'Bildirimler',
      href: '/notifications',
      icon: <NotificationsIcon size={20} />,
      badgeCount: 1,
      disabled: true,
    },
    {
      name: 'Çıkış Yap',
      href: '/',
      icon: <ProfileIcon size={20} />,
      onClick: handleLogout,
      isButton: true,
      disabled: isLogoutPending,
    },
  ];

  if (!user && !loading) {
    const authLinks = [
      {
        href: '/login',
        label: 'Giriş Yap',
        Icon: LoginIcon,
        wrapperClass:
          'flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition duration-150 ease-in-out',
      },
      {
        href: '/register',
        label: 'Kayıt Ol',
        Icon: RegisterIcon,
        wrapperClass:
          'px-4 py-2 text-sm font-semibold bg-[#d3deda] text-gray-600 rounded-lg shadow-sm hover:bg-[#f5f1ea] transition duration-150 ease-in-out transform hover:scale-105',
      },
    ];

    return (
      <div className="hidden lg:flex items-center space-x-6 flex-shrink-0">
        {authLinks.map(({ href, label, Icon, wrapperClass }) => (
          <Link key={href} href={href} className={wrapperClass}>
            <Icon className={`w-5 h-5 ${href === '/register' ? 'inline-block mr-1' : ''}`} aria-label={label} />
            {!isScrolled && <span>{label}</span>}
          </Link>
        ))}
      </div>
    );
  }

  const roleLabels: Record<string, string> = {
    user: 'User',
    admin: 'Admin',
    moderator: 'Moderator',
  };

  return (
    <div ref={dropdownRef} className="relative flex items-center gap-4 flex-shrink-0">
      <div className="flex items-center gap-4">
        <img
          src={user?.profile_img_url || '/no_profile.png'}
          alt={`${user?.username || 'User'} profile picture`}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="hidden xl:flex flex-col text-sm">
          <span className="font-bold text-gray-800 text-base">{user?.username}</span>
          <span className="text-xs text-gray-500">{roleLabels[user?.role || ''] || 'Unknown'}</span>
        </div>
      </div>

      <button
        onClick={handleDropdown}
        className="p-1 rounded-full hover:bg-gray-200 transition-all focus:outline-none cursor-pointer"
        aria-label={dropdownOpen ? 'Menüyü kapat' : 'Menüyü aç'}
        aria-expanded={dropdownOpen}
      >
        <ArrowDownIcon
          size={24}
          className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : 'rotate-0'}`}
        />
      </button>

      {dropdownOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-200 rounded-md shadow-lg z-50 
            animate-in fade-in slide-in-from-top-2 duration-200"
          role="menu"
          aria-orientation="vertical"
        >
          <ul className="py-1">
            {dropdownItems.map((item) =>
              item.isButton ? (
                <li key={item.name} className="border-t border-gray-200 mt-1 pt-1" role="none">
                  <button
                    onClick={item.onClick}
                    disabled={item.disabled}
                    className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    role="menuitem"
                  >
                    {item.disabled ? 'Çıkış Yapılıyor...' : item.name}
                  </button>
                </li>
              ) : (
                <li key={item.name} className="relative" role="none">
                  <Link
                    href={item.disabled ? '#' : item.href}
                    onClick={item.disabled ? undefined : closeDropdown}
                    className={`flex items-center gap-2 px-4 py-2 transition-colors 
                      ${
                        item.disabled
                          ? 'cursor-not-allowed text-gray-400 line-through'
                          : 'hover:bg-gray-100 text-gray-800'
                      }`}
                    aria-disabled={item.disabled}
                    role="menuitem"
                  >
                    <span
                      className={`flex items-center justify-center w-8 h-8 rounded-full 
                        ${item.disabled ? 'bg-gray-200' : 'bg-[#d3deda]'}`}
                    >
                      {item.icon}
                    </span>
                    {item.name}
                    {item.badgeCount && item.badgeCount > 0 && !item.disabled && (
                      <span
                        className="absolute top-1/2 -translate-y-1/2 right-4 inline-flex items-center justify-center h-4 w-4 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full"
                        aria-label={`${item.badgeCount} yeni bildirim`}
                      >
                        {item.badgeCount}
                      </span>
                    )}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default UserSection;
