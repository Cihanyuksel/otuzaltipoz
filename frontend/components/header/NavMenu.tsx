'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IoIosInformationCircleOutline as InformationCircleIcon, IoIosContacts as ContactIcon } from 'react-icons/io';
import { IoHomeOutline as HomeIcon } from 'react-icons/io5';

import { MdMonochromePhotos as PhotoIcon } from 'react-icons/md';

interface HeaderNavbarProps {
  isScrolled: boolean;
}

function HeaderNavbar({ isScrolled }: HeaderNavbarProps) {
  const pathname = usePathname();

  const links = [
    { name: 'Anasayfa', href: '/', icon: HomeIcon },
    { name: 'Fotoğraflar', href: '/photos', icon: PhotoIcon },
    { name: 'Hakkımızda', href: '/about', icon: InformationCircleIcon },
    { name: 'İletişim', href: '/contact', icon: ContactIcon },
  ];

  return (
    <>
      <nav className="hidden lg:flex items-center justify-around space-x-10">
        <ul className="flex items-center space-x-5 text-gray-500">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={`relative flex items-center gap-2 hover:text-gray-400 transition-colors duration-300 cursor-pointer p-1
                    ${isActive ? 'font-semibold' : ''}
                  `}
                >
                  <Icon className="h-5 w-5" />
                  {!isScrolled && <span>{link.name}</span>}
                  {isActive && !isScrolled && (
                    <span className="absolute -bottom-1 border border-[#d3deda] left-0 w-full bg-[#d3deda]"></span>
                  )}
                  {isActive && isScrolled && (
                    <span className="absolute -bottom-1 border border-[#d3deda] left-0 w-full bg-[#d3deda]"></span>
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

export default HeaderNavbar;
