import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-4">
      <div className="text-center">
        <h1 className="text-6xl sm:text-7xl font-extrabold text-gray-900 mb-4">
          404
        </h1>
        <h2 className="text-2xl sm:text-3xl font-semibold mb-2">
          Sayfa Bulunamadı
        </h2>
        <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Aradığınız sayfa mevcut değil. Lütfen URL'i kontrol edin veya ana sayfaya dönün.
        </p>
        <Link 
          href="/" 
          className="px-6 py-3 bg-[#ef7464] text-white font-bold rounded-lg shadow-md hover:bg-[#ef7464e0] transition-colors duration-300"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}