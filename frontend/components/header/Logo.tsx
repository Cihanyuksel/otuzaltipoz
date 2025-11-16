import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  isScrolled: boolean;
}

export default function Logo({ isScrolled }: LogoProps) {
  const scrolledClasses = isScrolled ? 'sm:w-24 md:w-24 lg:w-28' : 'sm:w-28 md:w-32 lg:w-36';

  return (
    <Link href="/" className="font-bold text-[#ef7464] block">
      <Image
        src="/logo.png"
        alt="Otuzaltıpoz Logo"
        priority
        width={200}
        height={200}
        className={`transition-all duration-300 w-24 ${scrolledClasses} h-auto object-contain block`}
      />
    </Link>
  );
}
