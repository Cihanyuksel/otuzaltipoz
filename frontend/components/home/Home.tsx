'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      {user && <section className="bg-white py-6 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-200 p-6 shadow-md">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,<svg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%20100%20100%22%20preserveAspectRatio=%22none%22%20stroke=%22%23e5e7eb%22%20stroke-width=%220.5%22><path%20d=%22M0%2050h100M50%200v100%22/%20stroke-dasharray=%221%201%22/></svg>')] opacity-20"></div>

            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Image
                src={user?.profile_img_url ?? '/no_profile.png'}
                alt={`${user?.username} profile picture`}
                width={64}
                height={64}
                className="h-16 w-16 rounded-full border-4 border-white shadow-sm"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800">Hoşgeldin {user?.username}!</h2>
                <p className="text-sm text-gray-600 mt-1">İşte son aktivitelerin:</p>
              </div>
            </div>
          </div>
        </div>
      </section>}

      {/* Hero Section */}
      <section
        className="relative w-full h-[55vh] bg-cover bg-center text-white flex items-center justify-center"
        style={{ backgroundImage: 'url("/images/hero-bg.jpg")' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 text-center px-4">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">Günün Fotoğrafları</h2>
          <p className="mt-4 text-lg sm:text-xl max-w-2xl mx-auto">
            Topluluğumuzdan ilham veren anları keşfedin ve kendi hikayenizi paylaşın.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button className="bg-white text-gray-800 hover:bg-gray-200 transition-colors font-semibold py-3 px-6 rounded-full">
              Explore Gallery
            </button>
            <button className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-800 transition-colors font-semibold py-3 px-6 rounded-full">
              Submit Photo
            </button>
          </div>
        </div>
      </section>

      {/* Discover Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">Keşfet</h2>
            <p className="mt-4 text-lg text-gray-600">Fotoğrafçılık dünyasının derinliklerine dalın.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <Link href="#" className="group block">
              <div className="overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <div className="relative h-64">
                  <Image
                    src="/images/photo-history.jpg" // Resim yolunu projenize göre güncelleyin
                    alt="Fotoğrafın Tarihi"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-[#e6a84c] transition-colors">
                    Fotoğrafın Tarihi
                  </h3>
                  <p className="mt-2 text-base text-gray-600">Fotoğrafçılığın evrimine bir yolculuk.</p>
                </div>
              </div>
            </Link>
            <Link href="#" className="group block">
              <div className="overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <div className="relative h-64">
                  <Image
                    src="/images/iconic-cameras.jpg" // Resim yolunu projenize göre güncelleyin
                    alt="İkonik Kameralar"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-[#e6a84c] transition-colors">
                    İkonik Kameralar
                  </h3>
                  <p className="mt-2 text-base text-gray-600">
                    Fotoğrafçılığı şekillendiren efsanevi kameraları keşfedin.
                  </p>
                </div>
              </div>
            </Link>
            <Link href="#" className="group block">
              <div className="overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <div className="relative h-64">
                  <Image
                    src="/images/famous-photographers.jpg" // Resim yolunu projenize göre güncelleyin
                    alt="Ünlü Fotoğrafçılar"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-[#e6a84c] transition-colors">
                    Ünlü Fotoğrafçılar
                  </h3>
                  <p className="mt-2 text-base text-gray-600">
                    Objektifleriyle dünyayı değiştiren vizyonerlerle tanışın.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
