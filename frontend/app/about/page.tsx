import AboutUs from '@/components/about-us/AboutUs';
import { createPageMetadata } from 'lib/metadata';

export const metadata = createPageMetadata({
  title: 'Hakkımızda | otuzaltıpoz',
  description:
    'Fotoğraf paylaşım platformumuz hakkında daha fazla bilgi edinin. Misyonumuz, vizyonumuz ve topluluğumuz hakkında detayları keşfedin.',
  path: '/about',
  image: '/images/about-og-image.jpg',
});

export default function AboutUsPage() {
  return <AboutUs />;
}
