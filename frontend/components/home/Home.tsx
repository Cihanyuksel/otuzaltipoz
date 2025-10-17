import HomeUserSection from './HomeUserSection';
import HeroSection from './HeroSection';
import DiscoverSection from './DiscoverSection';
import AnimatedSection from '../common/animated-section';
import PopularPhotosSection from './PopularPhotosSection';

export default function Home() {
  return (
    <div className='overflow-x-hidden'>
      <AnimatedSection delay={0}>
        <HomeUserSection />
      </AnimatedSection>

      <AnimatedSection delay={200}>
        <HeroSection />
      </AnimatedSection>

      <AnimatedSection delay={200}>
        <PopularPhotosSection />
      </AnimatedSection>

      <AnimatedSection delay={500}>
        <DiscoverSection />
      </AnimatedSection>
    </div>
  );
}
