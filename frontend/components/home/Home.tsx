'use client';
import { useAuth } from '@/context/AuthContext';
import HomeUserSection from './HomeUserSection';
import HeroSection from './HeroSection';
import DiscoverSection from './DiscoverSection';
import AnimatedSection from '../common/animated-section';
import PopularPhotosSeciton from './PopulerPhotosSection';

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      <AnimatedSection delay={0}>
        <HomeUserSection user={user} />
      </AnimatedSection>

      <AnimatedSection delay={200}>
        <HeroSection user={user} />
      </AnimatedSection>

      <AnimatedSection delay={500}>
        <PopularPhotosSeciton />
      </AnimatedSection>

      <AnimatedSection delay={500}>
        <DiscoverSection />
      </AnimatedSection>
    </>
  );
}
