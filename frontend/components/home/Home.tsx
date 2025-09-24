'use client';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { photoService } from 'services/photoService';
import HomeUserSection from './HomeUserSection';
import HeroSection from './HeroSection';
import DiscoverSection from './DiscoverSection';

export default function Home() {
  const { user } = useAuth();

  const [randomPhoto, setRandomPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRandomPhoto = async () => {
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
    const interval = setInterval(fetchRandomPhoto, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <HomeUserSection user={user} />
      <HeroSection randomPhoto={randomPhoto} loading={loading} user={user} />
      <DiscoverSection />
    </>
  );
}
