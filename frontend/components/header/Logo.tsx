import Image from 'next/image';
import Link from 'next/link';

interface ILogo {
  isScrolled: boolean;
}

export default function Logo({ isScrolled }: ILogo) {
  const scrolledClasses = isScrolled ? 'sm:w-24 md:w-24 lg:w-28' : 'sm:w-28 md:w-32 lg:w-36';

  return (
    <Link href="/" className="font-bold text-[#ef7464] cursor-pointer">
      <Image
        src="/logo.png"
        alt="Otuzaltıpoz Logo"
        priority
        width={600}
        height={600}
        className={`transition-all duration-300 w-24 ${scrolledClasses} h-auto object-contain block`}
      />
    </Link>
  );
}
