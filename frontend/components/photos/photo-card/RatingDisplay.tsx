import React from 'react';
interface IRatingSection {
  averageRating: number;
  totalVotes: number;
}
function RatingDisplay({ averageRating, totalVotes }: IRatingSection) {
  return (
    <div className="flex justify-between items-center lg:gap-1 ml-3">
      <span className="text-gray-500 text-xs font-bold">
        Ortalama Puan: <span className="font-bold text-gray-700">{averageRating.toFixed(2)}</span> / 5
      </span>
      <span className="text-xs text-gray-400">({totalVotes} oy)</span>
    </div>
  );
}

export default RatingDisplay;
