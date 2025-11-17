import DiscoverCard from './DiscoverCard';

function DiscoverSection() {
  const discoverCards = [
    {
      href: '/photography-history',
      src: '/discover-section/photography_history.jpg',
      alt: 'Fotoğrafın Tarihi',
      title: 'Fotoğrafın Tarihi',
      description: 'Fotoğrafçılığın evrimine bir yolculuk.',
    },
    {
      href: '/iconic-cameras',
      src: '/discover-section/iconic_camera.jpg',
      alt: 'İkonik Kameralar',
      title: 'İkonik Kameralar',
      description: 'Fotoğrafçılığı şekillendiren efsanevi kameraları keşfedin.',
    },
    {
      href: '/photographers',
      src: '/discover-section/popular_photographers.jpg',
      alt: 'Ünlü Fotoğrafçılar',
      title: 'Ünlü Fotoğrafçılar',
      description: 'Objektifleriyle dünyayı değiştiren vizyonerlerle tanışın.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">Keşfet</h2>
          <p className="mt-4 text-lg text-gray-600">Fotoğrafçılık dünyasının derinliklerine dalın.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {discoverCards.map((card, index) => (
            <DiscoverCard key={index} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default DiscoverSection;
