'use client'
import { useAuth } from '@/context/AuthContext';
import { motion, Variants } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { photoService } from 'services/photoService';

function HeroSection() {
  const [randomPhoto, setRandomPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const MotionImage = motion.create(Image);
  const PHOTO_CHANGE_INTERVAL_MS = 6000;

  const fetchRandomPhoto = async () => {
    setLoading(true);

    try {
      const response = await photoService.getRandomPhoto(1);
      const { data: photos } = response;
      if (photos && photos.length > 0) {
        setRandomPhoto(photos[0].photo_url);
      } else {
        setRandomPhoto('/image-not-found.png');
      }
    } catch (error) {
      console.error(error);
      setRandomPhoto('/image-not-found.png');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomPhoto();
    const interval = setInterval(fetchRandomPhoto, PHOTO_CHANGE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const imageVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.7, ease: 'easeInOut' } },
  };

  return (
    <>
      <section className="relative w-full h-[85vh] bg-cover bg-center text-white flex items-center justify-center">
        {loading || !randomPhoto ? (
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
        ) : (
          randomPhoto && (
            <MotionImage
              key={randomPhoto}
              src={randomPhoto}
              alt="Günün Fotoğrafı"
              fill
              className="absolute inset-0 -z-10 object-cover"
              priority
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            />
          )
        )}

        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center px-4">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">Günün Fotoğrafları</h2>
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
