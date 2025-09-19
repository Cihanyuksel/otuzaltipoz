'use client';

import { Logo, UserSection, MobileMenu, NavMenu, SearchBar } from '@/components/header';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout, loading, setAuth } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isLogoutPending = logout.isPending;

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: async () => {
        setAuth(null);
        router.push('/');
      },
      onError: (error) => {
        console.error(error);
      },
    });

    setDropdownOpen(false);
  };
  const handleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const userProps = {
    user,
    loading,
    dropdownOpen,
    setDropdownOpen,
    handleDropdown,
    handleLogout,
    isLogoutPending,
  };

  const mobileMenuProps = {
    setMenuOpen,
    menuOpen,
    handleLogout,
    loading,
    user,
  };

  return (
    <header className="fixed top-0 mb-2 px-4 w-full bg-[#f5f1ea] text-gray-800 flex justify-between items-center z-50 shadow-xl">
      <Logo />
      <NavMenu />
      {pathname === '/photos' && <SearchBar />}
      <UserSection {...userProps} />
      <MobileMenu {...mobileMenuProps} />
    </header>
  );
}
