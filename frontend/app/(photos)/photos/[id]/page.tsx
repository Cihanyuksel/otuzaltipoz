import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import Loader from '@/components/common/loader';
import PhotoDetail from '@/components/photo-detail/PhotoDetail';
import { Suspense } from 'react';
import { queryClient } from 'lib/queryClient';
import { API_BASE_URL } from 'lib/config';
import { createPageMetadata } from 'lib/metadata';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const res = await fetch(`${API_BASE_URL}/photos/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Photo not found');
    }

    const result = await res.json();
    const photo = result.data;

    return createPageMetadata({
      title: `fotoğraf: ${photo?.title || 'fotoğraf'} | otuzaltıpoz`,
      description: photo?.description || `${photo?.title || 'Fotoğraf'} fotoğrafını inceleyin.`,
      path: `/photos/${id}`,
      image: photo?.photo_url || '/og-default.jpg',
    });
  } catch (error) {
    return createPageMetadata({
      title: 'Fotoğraf Bulunamadı | otuzaltıpoz',
      description: 'Aradığınız fotoğraf bulunamadı.',
      path: `/photos/${id}`,
      image: '/og-default.jpg',
    });
  }
}

async function prefetchPhoto(id: string) {
  try {
    await queryClient.prefetchQuery({
      queryKey: ['photos', id],
      queryFn: async () => {
        const res = await fetch(`${API_BASE_URL}/photos/${id}`, {
          next: { revalidate: 60 },
        });

        if (!res.ok) throw new Error('Photo not found');
        const result = await res.json();
        return result.data;
      },
    });
  } catch (error) {
    console.error('SSR Prefetch error:', error);
    queryClient.setQueryData(['photos', id], {
      error: true,
      message: (error as Error).message,
    });
  }

  return dehydrate(queryClient);
}

export default async function PhotoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dehydratedState = await prefetchPhoto(id);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense fallback={<Loader />}>
        <PhotoDetail />
      </Suspense>
    </HydrationBoundary>
  );
}
