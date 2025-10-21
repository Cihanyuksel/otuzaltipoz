import HomeUserSection from './HomeUserSection';
import HeroSection from './HeroSection';
import DiscoverSection from './DiscoverSection';
import AnimatedSection from '../common/animated-section';
import PopularPhotosSection from './PopularPhotosSection';

export default function Home() {
  const sections = [
    { component: <HomeUserSection />, delay: 0 },
    { component: <HeroSection />, delay: 200 },
    { component: <PopularPhotosSection />, delay: 200 },
    { component: <DiscoverSection />, delay: 500 },
  ];

  return (
    <main className="overflow-x-hidden">
      {sections.map(({ component, delay }, index) => (
        <AnimatedSection key={index} delay={delay}>
          {component}
        </AnimatedSection>
      ))}
    </main>
  );
}
