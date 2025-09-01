'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

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

  return (
    <header className="bg-[#f5f1ea] text-gray-800 shadow-md px-6 py-4 flex justify-between items-center relative">
      <Link href="/" className="text-2xl font-bold text-[#ef7464]">
        FocusHUB
      </Link>
      <nav>
        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center space-x-6">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/photos">Photos</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>

          {!loading &&
            (user ? (
              <>
                <li className="px-4 py-1 border border-[#ef7464] rounded text-[#ef7464]">
                  {user.username}
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-1 border border-[#ef7464] rounded hover:bg-[#ef7464] hover:text-white transition"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/login"
                    className="px-4 py-1 border border-[#ef7464] rounded hover:bg-[#ef7464] hover:text-white transition"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="px-4 py-1 border border-[#ef7464] rounded hover:bg-[#ef7464] hover:text-white transition"
                  >
                    Register
                  </Link>
                </li>
              </>
            ))}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-800 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✖' : '☰'}
        </button>

        {/* Mobile Menu */}
        {menuOpen && (
          <ul className="absolute top-16 left-0 w-full bg-[#f5f1ea] flex flex-col items-center py-4 md:hidden space-y-4 shadow-lg">
            <li>
              <Link href="/" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/photos" onClick={() => setMenuOpen(false)}>
                Photos
              </Link>
            </li>
            <li>
              <Link href="/about" onClick={() => setMenuOpen(false)}>
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" onClick={() => setMenuOpen(false)}>
                Contact
              </Link>
            </li>

            {!loading &&
              (user ? (
                <>
                  <li className="px-4 py-1 border border-[#ef7464] rounded text-[#ef7464]">
                    {user.username}
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-1 border border-[#ef7464] rounded hover:bg-[#ef7464] hover:text-white transition"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="px-4 py-1 border border-[#ef7464] rounded hover:bg-[#ef7464] hover:text-white transition"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/register"
                      onClick={() => setMenuOpen(false)}
                      className="px-4 py-1 border border-[#ef7464] rounded hover:bg-[#ef7464] hover:text-white transition"
                    >
                      Register
                    </Link>
                  </li>
                </>
              ))}
          </ul>
        )}
      </nav>
    </header>
  );
};