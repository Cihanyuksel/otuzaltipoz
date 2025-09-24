import Image from 'next/image';
import photographers from '../../public/photographers.json';
import Link from 'next/link';

export default function PhotographersList() {
  return (
    <section className="flex-grow">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-8">
            Fotoğrafçılar
          </h2>
          <div className="space-y-4">
            {photographers.map((photographer) => (
              <Link
                key={photographer.name}
                className="group flex items-center gap-4 p-4 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-1"
                href={`/unlu-fotografcilar/${photographer.slug}`}
              >
                <div className="relative w-20 h-24 rounded flex-shrink-0">
                  <Image
                    src={photographer.avatar}
                    alt={photographer.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary transition-colors">
                    {photographer.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {photographer.short_biography}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
