export const commentFormatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();

  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  // < 1 dakika
  if (diffInMinutes < 1) {
    return 'Şimdi';
  }

  // < 60 dakika
  if (diffInMinutes < 60) {
    return `${diffInMinutes} dakika önce`;
  }

  // < 24 saat
  if (diffInHours < 24) {
    return `${diffInHours} saat önce`;
  }

  // < 7 gün → X gün önce
  if (diffInDays < 7) {
    return `${diffInDays} gün önce`;
  }

  // tam 7 gün → 1 hafta önce
  if (diffInDays === 7) {
    return '1 hafta önce';
  }

  // > 7 gün → tam tarih 
  const formattedDate = date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return formattedDate;
};
