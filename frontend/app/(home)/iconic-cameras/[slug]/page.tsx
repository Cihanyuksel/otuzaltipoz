import Image from 'next/image';
import { notFound } from 'next/navigation';
import cameras from '@/public/iconic-cameras.json';

interface ICameraDetail {
  params: {
    slug: string;
  };
}

export default async function CameraDetail({ params }: ICameraDetail) {
  const { slug } = await params;
  const camera = cameras.find((p) => p.slug === slug);

  if (!camera) notFound();

  return (
    <section className="flex-1 bg-[#f5f1ea]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-8">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                  {camera?.title}
                </h1>
              </div>

              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Genel Bakış</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{camera?.overview}</p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tarihçe</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{camera?.history}</p>
                </div>
              </div>
            </div>

            <div className="relative  aspect-[1/1] rounded-xl overflow-hidden shadow-md bg-white">
              <Image alt={camera!.title} src={camera!.url} fill className="object-contain object-center" />
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Temel Özellikler</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                  {camera?.specifications.other_features.map((text, index) => (
                    <div key={index} className="flex items-center gap-4 text-base text-gray-700 dark:text-gray-300">
                      <div className="flex h-3 w-3 bg-gray-600 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                        {' '}
                      </div>
                      <p>{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Özellikler</h3>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {[
                  ['Model', camera?.specifications.model],
                  ['Çıkış Yılı', camera?.specifications.release_year],
                  ['Lens', camera?.specifications.lens],
                  ['Enstantane Hızı', camera?.specifications.shutter_speed],
                  ['Film Tipi', camera?.specifications.film_type],
                ].map(([label, value], index) => (
                  <div key={index} className="py-3 flex justify-between text-sm">
                    <span className="font-medium text-gray-500 dark:text-gray-400">{label}</span>
                    <span className="text-gray-800 dark:text-gray-200">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
