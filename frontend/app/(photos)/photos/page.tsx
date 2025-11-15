import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import Loader from '@/components/common/loader';
import { Suspense } from 'react';
import { queryClient } from 'lib/queryClient';
import { photoService } from 'services/photoService';
import { createPageMetadata } from 'lib/metadata';
import PhotoContainer from '@/components/photos/photo-container/PhotoContainer';
import { PhotosProvider } from '@/context/PhotoContext';

export const metadata = createPageMetadata({
  title: 'Fotoğraflar | otuzaltıpoz',
  description: 'Tüm kategorilerdeki fotoğrafları keşfedin. otuzaltıpoz topluluğunda paylaşılan eşsiz anları inceleyin.',
  path: '/photos',
  image: '/og-photos.jpg',
});

async function prefetchPhotos() {
  try {
    const queryKey = [
      'photos',
      {
        searchQuery: '',
        hasToken: false,
        categories: undefined,
      },
    ];

    await queryClient.prefetchInfiniteQuery({
      queryKey: queryKey,
      queryFn: async ({ pageParam = 0 }) => {
        const data = await photoService.getAllPhoto({
          searchQuery: '',
          categories: undefined,
          offset: pageParam,
        });
        return data;
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        const totalFetched = allPages.reduce((sum, page) => sum + page.data.length, 0);
        if (!lastPage.data || totalFetched >= lastPage.totalRecords) {
          return undefined;
        }
        return allPages.length * 10;
      },
      pages: 1,
    });

    return dehydrate(queryClient);
  } catch (error) {
    console.error('SSR Prefetch error:', error);
    return dehydrate(queryClient);
  }
}

export default async function PhotosPage() {
  const dehydratedState = await prefetchPhotos();

  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense fallback={<Loader aria-label="Fotoğraflar yükleniyor..." />}>
        <PhotosProvider>
          <PhotoContainer />
        </PhotosProvider>
      </Suspense>
    </HydrationBoundary>
  );
}
