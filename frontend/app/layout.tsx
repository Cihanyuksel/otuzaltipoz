import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Noto_Sans } from 'next/font/google';
import './globals.css';
import Providers from '@/components/common/providers';
import Header from '@/components/header/Header';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-plus-jakarta' });
const notoSans = Noto_Sans({ subsets: ['latin'], variable: '--font-noto-sans' });

export const metadata: Metadata = {
  title: 'OTUZALTIPOZ',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="MyWebSite" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${plusJakarta.variable} ${notoSans.variable} antialiased`}>
        <Providers>
          <Header />
          <main className="pt-25">{children}</main>
          <ToastContainer position="top-right" autoClose={3000} aria-label="notification" />
        </Providers>
      </body>
    </html>
  );
}
