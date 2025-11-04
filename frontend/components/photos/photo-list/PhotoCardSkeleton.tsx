export const PhotoCardSkeleton = () => {
  return (
    <div className="rounded overflow-hidden shadow-lg border border-gray-200 animate-pulse">
      <div className="w-full h-64 bg-gray-300" />

      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4" />

        <div className="space-y-2">
          <div className="h-3 bg-gray-300 rounded w-full" />
          <div className="h-3 bg-gray-300 rounded w-5/6" />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-300 rounded w-1/3" />
            <div className="h-2 bg-gray-300 rounded w-1/4" />
          </div>
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="h-8 bg-gray-300 rounded w-20" />
      </div>
    </div>
  );
};
