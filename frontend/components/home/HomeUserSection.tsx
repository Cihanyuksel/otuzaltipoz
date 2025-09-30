'use client'
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

function HomeUserSection() {
  const { user } = useAuth();

  return (
    <>
      {user && (
        <section className="py-6 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
          <div className="max-w-4xl">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-lg border border-gray-100 dark:border-gray-700/50">
              <div className="flex flex-row items-center gap-5">
                <Image
                  src={user?.profile_img_url ?? '/no_profile.png'}
                  alt={`${user?.username} profil resmi`}
                  width={80}
                  height={80}
                  className="h-20 w-20 rounded-full border-4 border-indigo-500/50 object-cover shadow-lg"
                />

                <div className="flex-1 text-left">
                  <p className="text-lg font-medium text-gray-500 dark:text-gray-400">Tekrar Hoş Geldin,</p>
                  <h2 className="text-3xl font-light text-gray-900 dark:text-white mt-0.5 tracking-tight">
                    <span className="font-semibold">{user?.username}</span>!
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default HomeUserSection;
