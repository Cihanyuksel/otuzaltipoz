import Image from 'next/image';
import Link from 'next/link';

type IDiscoverCard = {
  href: string;
  src: string;
  alt: string;
  title: string;
  description: string;
};

function DiscoverCard({ href, src, description, title }: IDiscoverCard) {
  return (
    <>
      <Link href={href} className="group block">
        <div className="overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <div className="relative h-64">
            <Image className='object-cover' src={src} alt="Fotoğrafın Tarihi" fill />
          </div>
          <div className="p-6 bg-white">
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-[#e6a84c] transition-colors">
              {title}
            </h3>
            <p className="mt-2 text-base text-gray-600">{description}</p>
          </div>
        </div>
      </Link>
    </>
  );
}

export default DiscoverCard;
