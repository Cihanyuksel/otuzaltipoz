import Image from 'next/image';
import photographers from '../../../public/photographers.json';
import { notFound } from 'next/navigation';

type Params = {
  params: { slug: string };
};

export default async function PhotographerProfile({ params }: Params) {
  const { slug } = await params;
  const photographer = photographers.find((p) => p.slug === slug);

  if (!photographer) return notFound();

  return (
    <section className="flex flex-1 justify-center py-8 bg-[#d3deda] rounded">
      <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-4xl font-bold leading-tight tracking-tighter text-slate-900 dark:text-white">
            {photographer.name}
          </p>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            {photographer.short_biography}
          </p>
        </div>

        <div className="mb-12 flex flex-col gap-8 md:flex-row md:items-start">
          <div className="flex flex-shrink-0 items-center gap-6">
            <div className="relative h-32 w-32 flex-shrink-0 rounded-full">
              <Image
                src={photographer.avatar}
                alt={`${photographer.name} profile picture`}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {photographer.name}
              </p>
              <p className="text-base text-slate-600 dark:text-slate-400">
                {photographer.birthdate} - {photographer.deathdate ?? '...'}
              </p>
              <p className="text-base text-slate-600 dark:text-slate-400">{photographer.turu}</p>
            </div>
          </div>
          <div className="prose prose-lg max-w-none text-slate-700 dark:text-slate-300">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Biyografi
            </h2>
            <p>{photographer.biography}</p>
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            İkonik Fotoğraflar
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {photographer.photos.map((photo, index) => (
              <div
                key={index}
                className="aspect-square w-full rounded-lg relative overflow-hidden group"
              >
                <Image
                  src={photo.url}
                  alt={photo.title}
                  fill
                  className="rounded-lg object-cover transition-transform duration-300 group-hover:scale-110"
                />

                <div
                  className="absolute inset-0 flex items-center justify-center p-4 
                   bg-[#d3deda] bg-opacity-75 opacity-0 transition-opacity duration-300
                   group-hover:opacity-100"
                >
                  <span className="text-center text-md font-semibold text-gray-50">
                    {photo.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
