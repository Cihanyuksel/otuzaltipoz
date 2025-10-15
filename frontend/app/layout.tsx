import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Noto_Sans } from 'next/font/google';
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
    title: 'otuzaltıpoz',
    description: 'otuzaltıpoz ile fotoğraflarını paylaş, keşfet ve arşivle. Analog fotoğrafçılık topluluğuna katıl!',
    path: '/',
    image: '/og-home.jpg',
  }),
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  }
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
          <main className="mt-25">{children}</main>
          <ToastContainer position="top-right" autoClose={3000} aria-label="notification" />
        </Providers>
      </body>
    </html>
  );
}
