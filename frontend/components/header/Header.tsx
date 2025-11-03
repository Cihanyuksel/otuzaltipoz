'use client';
import { Logo, UserSection, MobileMenu, NavMenu, SearchBar } from '@/components/header';
import AnimatedSection from '../common/animated-section';
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
    pathname,
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
      {pathname === '/photos' && (
        <AnimatedSection delay={10}>
          <SearchBar isScrolled={isScrolled} />
        </AnimatedSection>
      )}
      <UserSection {...userProps} />
      <MobileMenu {...mobileMenuProps} />
    </header>
  );
}
