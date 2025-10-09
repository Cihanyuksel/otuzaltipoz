//next.js and react
import Link from 'next/link';
import { Dispatch, SetStateAction } from 'react';
import { usePathname } from 'next/navigation';
import { User } from 'types/auth';
//third-party
import { IoCloseOutline as MenuCloseIcon } from 'react-icons/io5';
import { RxHamburgerMenu as MenuOpenIcon } from 'react-icons/rx';
//project files
import MobileSearchBar from './MobileSearchBar';

interface IMobileMenu {
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
  menuOpen: boolean;
  user: User | null;
  loading: boolean;
  handleLogout: () => void;
}

export default function MobileMenu({ menuOpen, setMenuOpen, loading, user }: IMobileMenu) {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Ana Sayfa', href: '/' },
    { name: 'Fotoğraflar', href: '/photos' },
    { name: 'Hakkımızda', href: '/about' },
    { name: 'İletişim', href: '/contact' },
  ];

  return (
    <>
      <button className="lg:hidden text-gray-800 focus:outline-none relative w-8 h-8" onClick={() => setMenuOpen(!menuOpen)}>
        <MenuOpenIcon
          className={`absolute inset-0 m-auto text-2xl transition-all duration-300 ease-in-out ${
            menuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'
          }`}
        />
        <MenuCloseIcon
          className={`absolute inset-0 m-auto text-2xl transition-all duration-300 ease-in-out ${
            menuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
          }`}
        />
      </button>

      <div
        className={`fixed top-22 left-0 w-full lg:hidden transform transition-all duration-300 ease-in-out z-40 ${
          menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5 pointer-events-none'
        }`}
      >
        <ul className="bg-[#f5f1ea] flex flex-col items-center py-4 space-y-4 shadow-lg">
          {pathname === '/photos' && <MobileSearchBar />}
          {navLinks.map((link) => (
            <li key={link.name} className="w-full px-4">
              <Link
                href={link.href}
                className="w-full flex justify-center font-semibold items-center border border-gray-300 p-2"
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </Link>
            </li>
          ))}
          {!loading && !user && (
            <>
              <li className="w-full px-4">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="w-full flex justify-center items-center px-4 py-1 border border-[#ef7464] rounded hover:bg-[#ef7464] hover:text-white transition cursor-pointer"
                >
                  Giriş Yap
                </Link>
              </li>
              <li className="w-full px-4">
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="w-full flex justify-center items-center px-4 py-1 border list-none border-[#ef7464] rounded hover:bg-[#ef7464] hover:text-white transition cursor-pointer"
                >
                  Kayıt Ol
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </>
  );
}
