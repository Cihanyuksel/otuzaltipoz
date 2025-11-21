import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Noto_Sans } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import Providers from '@/components/common/providers';
import Header from '@/components/header/Header';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { createPageMetadata } from 'lib/metadata';

const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-plus-jakarta' });
const notoSans = Noto_Sans({ subsets: ['latin'], variable: '--font-noto-sans' });

export const metadata: Metadata = {
  ...createPageMetadata({
    title: 'otuzaltıpoz | fotoğraf paylaşım platformu',
    description: 'otuzaltıpoz ile fotoğraflarını paylaş, keşfet ve arşivle. Analog fotoğrafçılık topluluğuna katıl!',
    path: '/',
    image: '/og-share-logo.png',
  }),

  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
  themeColor: '#ffffff',

  other: {
    'msapplication-TileColor': '#ff7700',
  },

  openGraph: {
    title: 'otuzaltıpoz | fotoğraf paylaşım platformu',
    description: 'otuzaltıpoz ile fotoğraflarını paylaş, keşfet ve arşivle. Analog fotoğrafçılık topluluğuna katıl!',
    url: 'https://otuzaltipoz.com',
    siteName: 'otuzaltıpoz',
    images: [
      {
        url: '/og-share-logo.png',
        width: 1200,
        height: 630,
        alt: 'otuzaltıpoz Fotoğraf Topluluğu Logosu',
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'otuzaltıpoz | fotoğraf paylaşım platformu',
    description: 'otuzaltıpoz ile fotoğraflarını paylaş, keşfet ve arşivle. Analog fotoğrafçılık topluluğuna katıl!',
    images: ['/og-share-logo.png'],
    creator: '@otuzaltipoz',
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${plusJakarta.variable} ${notoSans.variable} antialiased`}>
        <Providers>
          <Header />
          <main className="mt-24">{children}</main>
          <ToastContainer position="top-right" autoClose={3000} aria-label="notification" />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
