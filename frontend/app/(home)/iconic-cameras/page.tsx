import cameras from '@/public/iconic-cameras.json';
import { createPageMetadata } from 'lib/metadata';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = createPageMetadata({
  title: 'İkonik Kameralar | otuzaltıpoz',
  description:
    'Fotoğraf makinelerinin efsanevi modellerini keşfet: Leica, Hasselblad, Rolleiflex ve daha fazlası. otuzaltıpoz topluluğunda fotoğrafçılığın tarihine yolculuk yap.',
  path: '/iconic-cameras',
  image: '/og-iconic-cameras.jpg',
});

const IconicCamerasPage = () => {
  return (
    <section className="min-h-screen flex flex-col bg-[#f5f1ea] font-display text-gray-800">
      <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-extrabold text-gray-900 tracking-tight">İkonik Kameralar</h2>
          <p className="mt-4 text-lg text-gray-600">
            Fotoğrafçılığa yön veren efsanevi kameraların özenle seçilmiş bir koleksiyonu.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cameras.map((camera, index) => (
            <Link
              key={index}
              className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-200"
              href={`/iconic-cameras/${camera.slug}`}
            >
              <div className="relative w-full h-56">
                <Image
                  src={camera.url}
                  alt={camera.title}
                  fill
                  className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-6 flex-grow bg-gray-50">
                <h3 className="text-lg font-bold text-gray-900">{camera.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{camera.overview}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IconicCamerasPage;
