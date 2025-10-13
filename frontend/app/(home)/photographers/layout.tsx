import Link from 'next/link';
import photographers from '@/public/photographers.json';

export default function PhotographerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="hidden md:flex z-10 fixed left-0 top-0 bottom-0 w-[220px] border-r-1 border-r-gray-400 bg-[#f5f1ea] text-gray-800 flex-col pt-24">
        <nav className="flex-1 overflow-y-auto pb-4">
          <ul>
            <li>
              <Link
                href={'/photographers'}
                className="block py-4 px-6 text-sm font-semibold tracking-wide hover:bg-gray-100 transition-colors duration-200"
              >
                Tüm Fotoğrafçılar
              </Link>
            </li>
            {photographers.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/photographers/${p.slug}`}
                  className="block py-3 px-6 text-sm hover:bg-gray-100 transition-colors duration-200"
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 ml-0 md:ml-[220px] p-4 sm:p-6 md:p-10 bg-white shadow-inner">
        {children}
      </main>
    </div>
  );
}