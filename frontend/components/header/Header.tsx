'use client';
import { Logo, UserSection, MobileMenu, NavMenu} from '@/components/header';
import { useHeader } from './useHeader';

export default function Header() {
  const {
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
  } = useHeader();

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

  const headerClasses = `fixed top-0 2xl:text-3xl w-full text-gray-800 flex justify-between items-center z-50 shadow-xl transition-all duration-300 ease-in-out bg-[#f5f1ea]
    ${isScrolled ? 'h-16 px-4 2xl:h-32 ' : 'h-25 px-8 2xl:h-44'}`;

  return (
    <header className={headerClasses}>
      <Logo isScrolled={isScrolled} />
      <NavMenu isScrolled={isScrolled} />
      <UserSection {...userProps} />
      <MobileMenu {...mobileMenuProps} />
    </header>
  );
}
