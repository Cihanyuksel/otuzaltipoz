import { useState } from 'react';
import { useGetPopularPhotos } from '@/hooks/api/usePhotoApi';

type TimeRange = 'all' | 'month' | 'week' | 'day';

const TABS = [
  { id: 'all' as TimeRange, label: 'Tüm Zamanlar' },
  { id: 'month' as TimeRange, label: 'Bu Ay' },
  { id: 'week' as TimeRange, label: 'Bu Hafta' },
  { id: 'day' as TimeRange, label: 'Bugün' },
];

export const usePopularPhotosLogic = () => {
  const [activeTab, setActiveTab] = useState<TimeRange>('all');

  const { data: photos = [], isLoading, isError } = useGetPopularPhotos(activeTab);

  const handleTabChange = (timeRange: TimeRange) => {
    if (timeRange === activeTab) return;
    setActiveTab(timeRange);
  };

  const formatCount = (count: number): string => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  return {
    tabs: TABS,
    activeTab,
    photos,
    isLoading,
    isError,
    handleTabChange,
    formatCount,
  };
};
