import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  isScrolled: boolean;
}

export default function Logo({ isScrolled }: LogoProps) {
  const logoWidth = isScrolled ? 100 : 150;
  const logoHeight = isScrolled ? 100 : 150;

  return (
    <>
      <Link href="/" className="font-bold text-[#ef7464]">
        <Image
          src={'/logo.png'}
          alt="Otuzaltıpoz Logo"
          priority
          width={logoWidth}
          height={logoHeight}
          className="transition-all duration-300"
        />
      </Link>
    </>
  );
}