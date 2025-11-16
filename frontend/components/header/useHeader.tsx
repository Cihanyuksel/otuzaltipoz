import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const useHeader = () => {
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
    setDropdownOpen(false);

    logout.mutate(undefined, {
      onSuccess: () => {
        setAuth(null);
      },
      onError: () => {
        router.back();
      },
    });
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

export default useHeader;
