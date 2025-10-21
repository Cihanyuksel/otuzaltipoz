import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import PhotoContainer from '@/components/photos/PhotoContainer';
import Loader from '@/components/common/loader';
import { Suspense } from 'react';
import { queryClient } from 'lib/queryClient';
import { photoService } from 'services/photoService';
import { createPageMetadata } from 'lib/metadata';

export const metadata = createPageMetadata({
  title: 'Fotoğraflar | otuzaltıpoz',
  description: 'Tüm kategorilerdeki fotoğrafları keşfedin. otuzaltıpoz topluluğunda paylaşılan eşsiz anları inceleyin.',
  path: '/photos',
  image: '/og-photos.jpg',
});

async function prefetchPhotos() {
  try {
    await queryClient.prefetchInfiniteQuery({
      queryKey: ['photos', { searchQuery: '', hasToken: false, categories: '' }],
      queryFn: async ({ pageParam = 0 }) => {
        const data = await photoService.getAllPhoto({
          searchQuery: '',
          categories: '',
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

    const dehydrated = dehydrate(queryClient);

    return dehydrated;
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
        <div className="flex-1">
          <PhotoContainer />
        </div>
      </Suspense>
    </HydrationBoundary>
  );
}
