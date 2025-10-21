'use client';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

function HomeUserSection() {
  const { user } = useAuth();
  if (!user) return null;

  const profileImage = user.profile_img_url || '/no_profile.png';

  return (
    <section className="py-6 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
      <div className="max-w-4xl">
        <article className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-lg border border-gray-100 dark:border-gray-700/50">
          <header className="flex items-center gap-5">
            <Image
              src={profileImage}
              alt={`${user.username} profil resmi`}
              width={80}
              height={80}
              className="h-20 w-20 rounded-full border-4 border-indigo-500/50 object-cover shadow-lg"
            />

            <div>
              <p className="text-lg text-gray-500 dark:text-gray-400">Tekrar Hoş Geldin,</p>
              <h2 className="text-3xl text-gray-900 dark:text-white mt-0.5 tracking-tight">
                <span className="font-semibold">{user.username}</span>!
              </h2>
            </div>
          </header>
        </article>
      </div>
    </section>
  );
}

export default HomeUserSection;
