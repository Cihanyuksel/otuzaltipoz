import Link from 'next/link';
import React from 'react';

export default function HeaderNavbar() {
  return (
    <>
      <nav className="hidden md:flex items-center justify-around space-x-10">
        <ul className="flex items-center space-x-10">
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
    </>
  );
}
