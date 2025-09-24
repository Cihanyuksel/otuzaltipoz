import Image from 'next/image';
import Link from 'next/link';
import { User } from 'types/auth';

export type IHeroSection = {
  randomPhoto?: string | null;
  loading: boolean;
  user?: User | null;
};

function HeroSection({ randomPhoto, loading, user }: IHeroSection) {
  return (
    <>
      <section className="relative w-full h-[55vh] bg-cover bg-center text-white flex items-center justify-center">
        {loading ? (
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
        ) : (
          randomPhoto && (
            <Image
              src={randomPhoto}
              alt="Günün Fotoğrafı"
              fill
              className="absolute inset-0 -z-10 object-cover"
              priority
            />
          )
        )}

        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center px-4">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Günün Fotoğrafları
          </h2>
          <p className="mt-4 text-lg sm:text-xl max-w-2xl mx-auto">
            Topluluğumuzdan ilham veren anları keşfedin ve kendi hikayenizi paylaşın.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            {user && (
              <Link
                href={'/photo-upload'}
                className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-800 transition-colors font-semibold py-3 px-6 rounded-full cursor-pointer"
              >
                Fotoğraf Yükle
              </Link>
            )}
            <Link
              href={'/photos'}
              className="bg-white text-gray-800 hover:bg-gray-200 transition-colors font-semibold py-3 px-6 rounded-full cursor-pointer"
            >
              Galeriyi Keşfet
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default HeroSection;
