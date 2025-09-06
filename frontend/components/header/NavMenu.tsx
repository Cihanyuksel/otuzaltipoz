'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function HeaderNavbar() {
  const pathname = usePathname();

  const links = [
    { name: 'Anasayfa', href: '/' },
    { name: 'Fotoğraflar', href: '/photos' },
    { name: 'Hakkımızda', href: '/about' },
    { name: 'İletişim', href: '/contact' },
  ];

  return (
    <>
      <nav className="hidden md:flex items-center justify-around space-x-10">
        <ul className="flex items-center space-x-10">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={`relative  hover:text-gray-500 transition-colors duration-300
                    ${isActive ? 'font-semibold' : ''}
                  `}
                >
                  {link.name}
                  {isActive && (
                    <span
                      className="absolute -bottom-1 border border-[#d3deda] left-0 w-full"
                      style={{ backgroundColor: '#d3deda' }}
                    ></span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
