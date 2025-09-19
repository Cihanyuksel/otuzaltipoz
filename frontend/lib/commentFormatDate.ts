export const commentFormatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();

  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  // less than 1 minute
  if (diffInMinutes < 1) {
    return 'Şimdi';
  }

  // less than 60 minutes: "X minutes ago"
  if (diffInMinutes < 60) {
    return `${diffInMinutes} dakika önce`;
  }

  // less than 24 hours: "X hours ago"
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} saat önce`;
  }

  // more than 1 day has passed: full date and time
  const formattedDate = date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const formattedTime = date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

  return `${formattedDate} - ${formattedTime}`;
};
