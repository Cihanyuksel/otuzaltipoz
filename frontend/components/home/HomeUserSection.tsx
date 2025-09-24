import Image from 'next/image';
import { User } from 'types/auth';

type IHomeUserSection = {
  user?: User | null;
};

function HomeUserSection({ user }: IHomeUserSection) {
  return (
    <>
      {user && (
        <section className="bg-white py-6 px-4 sm:px-6 lg:px-8">
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
        </section>
      )}
    </>
  );
}

export default HomeUserSection;
