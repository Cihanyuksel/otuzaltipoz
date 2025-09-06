'use client';
import { Logo, UserSection, MobileMenu, NavMenu, SearchBar } from '@/components/header';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout, loading, setAuth } = useAuth();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        setAuth(null);
      },
      onError: (err) => console.log(err),
    });
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
  };

  const mobileMenuProps = {
    setMenuOpen,
    menuOpen,
    handleLogout,
    loading,
    user,
  };

  return (
      <header className="bg-[#f5f1ea] text-gray-800 shadow-md px-6 py-4 flex justify-between items-center relative z-50">
        <Logo />
        <NavMenu />
        <SearchBar />
        <UserSection {...userProps} />
        <MobileMenu {...mobileMenuProps} />
      </header>
  );
}
