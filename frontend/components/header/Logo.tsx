import Image from 'next/image';
import Link from 'next/link';

export default function Logo() {
  return (
    <>
      <Link href="/" className="font-bold text-[#ef7464] h-25">
        <Image src={'/logo.png'} alt="Focus HUB Logo" priority width={150} height={150} />
      </Link>
    </>
  );
}
