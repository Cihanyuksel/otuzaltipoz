'use client';
import { Logo, UserSection, MobileMenu, NavMenu, SearchBar } from '@/components/header';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { user, logout, loading, setAuth } = useAuth();

  const isLogoutPending = logout.isPending;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
    isScrolled,
  };

  const mobileMenuProps = {
    setMenuOpen,
    menuOpen,
    handleLogout,
    loading,
    user,
  };

  const headerClasses = `fixed top-0 w-full text-gray-800 flex justify-between items-center z-50 shadow-xl transition-all duration-300 ease-in-out bg-[#f5f1ea]
    ${isScrolled ? 'h-16 px-4 ' : 'h-24 px-8 '}`;

  return (
    <header className={headerClasses}>
      <Logo isScrolled={isScrolled} />
      <NavMenu isScrolled={isScrolled} />
      {pathname === '/photos' && <SearchBar isScrolled={isScrolled} />}
      <UserSection {...userProps} />
      <MobileMenu {...mobileMenuProps} />
    </header>
  );
}
