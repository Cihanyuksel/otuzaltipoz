import Image from 'next/image';
import Link from 'next/link';

export default function Logo() {
  return (
    <>
      <Link href="/" className="text-2xl font-bold text-[#ef7464]">
        <Image src={'/logo.png'} alt="Focus HUB Logo" priority width={120} height={120} />
      </Link>
    </>
  );
}
