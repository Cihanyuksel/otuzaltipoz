const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const createPageMetadata = ({ title, description, path, image }: {
  title: string;
  description: string;
  path: string;
  image: string;
}) => ({
  metadataBase: new URL(baseUrl),
  title,
  description,
  alternates: {
    canonical: path,
  },
  openGraph: {
    title,
    description,
    url: path,
    siteName: 'otuzaltıpoz',
    images: [
      {
        url: image,
        width: 1200,
        height: 630,
        alt: `${title} sayfası`,
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@otuzaltipoz',
    title,
    description,
    images: [image],
  },
});