import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export const useHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { user, logout, loading, setAuth } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isLogoutPending = logout.isPending;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        setAuth(null);
        router.push('/login');
      },
      onError: () => router.back(),
    });
    setDropdownOpen(false);
  };

  const handleDropdown = () => setDropdownOpen(!dropdownOpen);

  return {
    menuOpen,
    setMenuOpen,
    dropdownOpen,
    setDropdownOpen,
    isScrolled,
    user,
    loading,
    isLogoutPending,
    handleLogout,
    handleDropdown,
    pathname,
  };
};
