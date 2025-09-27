import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  const iconStyle =
    'text-xl text-gray-600 hover:text-gray-800 transition-colors duration-200';

  const socialMedia = [
    {
      href: 'https://github.com/cihanyuksel',
      label: 'GitHub',
      icon: <FaGithub className={iconStyle} />,
    },
    {
      href: 'https://linkedin.com/in/cihanyyuksel',
      label: 'LinkedIn',
      icon: <FaLinkedin className={iconStyle} />,
    },
    {
      href: 'https://x.com/rhinelanddd',
      label: 'Twitter',
      icon: <FaTwitter className={iconStyle} />,
    },
    {
      href: 'https://instagram.com/otuzaltipoz',
      label: 'Instagram',
      icon: <FaInstagram className={iconStyle} />,
    },
  ];

  return (
    <footer className="bg-[#f5f0e9] text-left p-7">
      <p className="text-sm text-gray-600">
        © {new Date().getFullYear()} Otuzaltıpoz. Tüm hakları saklıdır.
      </p>

      <hr className="border-gray-300 mb-4" />

      <div className="flex justify-start space-x-6">
        {socialMedia.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
          >
            {item.icon}
          </a>
        ))}
      </div>
    </footer>
  );
}
