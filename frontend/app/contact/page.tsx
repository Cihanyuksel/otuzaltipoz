import Contact from '@/components/contact/Contact';
import { createPageMetadata } from 'lib/metadata';

export const metadata = createPageMetadata({
  title: 'İletişim | otuzaltıpoz',
  description:
    'otuzaltıpoz ile iletişime geçin! Sorularınız, önerileriniz veya destek talepleriniz için bizimle kolayca bağlantı kurabilirsiniz.',
  path: '/contact',
  image: '/images/contact-og-image.jpg',
});

export default function ContactPage() {
  return <Contact />;
}
