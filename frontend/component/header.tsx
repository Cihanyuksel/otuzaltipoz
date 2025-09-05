'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Image from 'next/image';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, loading, setAuth } = useAuth();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        setAuth(null);
      },
      onError: (err) => console.log(err),
    });
  };
  console.log(user, 'USEEEEEEEER');
  return (
    <header className="bg-[#f5f1ea] text-gray-800 shadow-md px-6 py-4 flex justify-between items-center relative">
      <Link href="/" className="text-2xl font-bold text-[#ef7464]">
        <Image src={'/logo.png'} alt="Focus HUB Logo" priority width={120} height={120} />
      </Link>
      <nav className="flex items-center justify-around">
        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center space-x-10">
          <li>
            <Link href="/">Anasayfa</Link>
          </li>
          <li>
            <Link href="/photos">Fotoğraflar</Link>
          </li>
          <li>
            <Link href="/about">Hakkımızda</Link>
          </li>
          <li>
            <Link href="/contact">İletişim</Link>
          </li>
        </ul>
      </nav>

      {!loading &&
        (user ? (
          <div className="flex space-x-5">
            <li className="px-4 py-1 border border-[#ef7464] rounded text-[#ef7464] list-none">{user.username}</li>
            <Image src={user?.profile_img_url} alt="Focus HUB Logo" priority width={32} height={32} className='rounded-full object-cover' />
            <li className="list-none">
              <button
                onClick={handleLogout}
                className="px-4 py-1 border border-[#ef7464] rounded hover:bg-[#ef7464] hover:text-white transition cursor-pointer"
              >
                Çıkış Yap
              </button>
            </li>
          </div>
        ) : (
          <div className="flex space-x-5">
            <li className="list-none">
              <Link
                href="/login"
                className="px-4 py-1 border border-[#ef7464] rounded hover:bg-[#ef7464] hover:text-white transition cursor-pointer"
              >
                Giriş Yap
              </Link>
            </li>
            <li className="list-none">
              <Link
                href="/register"
                className="px-4 py-1 border border-[#ef7464] rounded hover:bg-[#ef7464] hover:text-white transition cursor-pointer"
              >
                Kayıt Ol
              </Link>
            </li>
          </div>
        ))}

      {/* Mobile Menu Button */}
      <button className="md:hidden text-gray-800 focus:outline-none" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? '✖' : '☰'}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="absolute top-16 left-0 w-full bg-[#f5f1ea] flex flex-col items-center py-4 md:hidden space-y-4 shadow-lg">
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
    </header>
  );
};