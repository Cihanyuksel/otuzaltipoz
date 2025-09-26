import Link from 'next/link';
import photographers from '@/public/photographers.json';

export default function PhotographerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="fixed left-0 top-0 h-full w-[220px] border-r-1 border-r-gray-400 bg-[#f5f1ea] text-gray-800 shadow-xl flex flex-col pt-24">
        <nav className="flex-1 overflow-y-auto">
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
      <main className="flex-1 ml-[220px] p-10 bg-white shadow-inner">{children}</main>
    </div>
  );
}
