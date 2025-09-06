import Link from 'next/link';
import { Dispatch, SetStateAction } from 'react';
import { User } from 'types/auth';

interface IMobileMenu {
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
  menuOpen: boolean;
  user: User | null;
  loading: boolean;
  handleLogout: () => void;
}

export default function MobileMenu({ menuOpen, setMenuOpen, handleLogout, loading, user }: IMobileMenu) {
  return (
    <>
      <button className="md:hidden text-gray-800 focus:outline-none" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? '✖' : '☰'}
      </button>
      {menuOpen && (
        <ul className="absolute top-16 left-0 w-full bg-[#f5f1ea] flex flex-col items-center py-4 md:hidden space-y-4 shadow-lg z-40">
          <li>
            <Link href="/" onClick={() => setMenuOpen(false)}>
              Ana Sayfa
            </Link>
          </li>
          <li>
            <Link href="/photos" onClick={() => setMenuOpen(false)}>
              Fotoğraflar
            </Link>
          </li>
          <li>
            <Link href="/about" onClick={() => setMenuOpen(false)}>
              Hakkımızda
            </Link>
          </li>
          <li>
            <Link href="/contact" onClick={() => setMenuOpen(false)}>
              İletişim
            </Link>
          </li>
          {!loading &&
            (user ? (
              <>
                <li className="px-4 py-1 border border-[#ef7464] rounded text-[#ef7464]">{user.username}</li>
                <li className="list-none">
                  <button
                    onClick={handleLogout}
                    className="px-4 py-1 border border-[#ef7464] rounded hover:bg-[#ef7464] hover:text-white transition cursor-pointer"
                  >
                    Çıkış Yap
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-1 border border-[#ef7464] rounded hover:bg-[#ef7464] hover:text-white transition cursor-pointer"
                  >
                    Giriş Yap
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-1 border list-none border-[#ef7464] rounded hover:bg-[#ef7464] hover:text-white transition cursor-pointer"
                  >
                    Kayıt Ol
                  </Link>
                </li>
              </>
            ))}
        </ul>
      )}
    </>
  );
}
