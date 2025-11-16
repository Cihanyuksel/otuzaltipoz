// next.js and react
import Link from 'next/link';
import { Dispatch, SetStateAction } from 'react';
import { usePathname } from 'next/navigation';
import { User } from 'types/auth';

// third-party
import { IoCloseOutline as MenuCloseIcon } from 'react-icons/io5';
import { RxHamburgerMenu as MenuOpenIcon } from 'react-icons/rx';
import { AnimatePresence, motion, Variants } from 'framer-motion';

interface IMobileMenu {
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
  menuOpen: boolean;
  user: User | null;
  loading: boolean;
}

const menuVariants: Variants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
};

const navLinkVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05 + 0.2,
      ease: 'easeOut',
    },
  }),
};

export default function MobileMenu({ menuOpen, setMenuOpen, loading, user }: IMobileMenu) {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Ana Sayfa', href: '/' },
    { name: 'Fotoğraflar', href: '/photos' },
    { name: 'Hakkımızda', href: '/about' },
    { name: 'İletişim', href: '/contact' },
  ];

  return (
    <>
      <button
        className="lg:hidden text-gray-800 focus:outline-none relative z-50 w-8 h-8"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menüyü aç/kapat"
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={menuOpen ? 'close' : 'open'}
            initial={{ opacity: 0, rotate: 90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: -90 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 m-auto"
          >
            {menuOpen ? <MenuCloseIcon size={28} /> : <MenuOpenIcon size={26} />}
          </motion.div>
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 z-40 h-screen w-screen bg-white/50 backdrop-blur-md lg:hidden"
          >
            <nav className="flex h-full w-full flex-col items-center justify-center">
              <ul className="flex flex-col items-center gap-8">
                {navLinks.map((link, i) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.li key={link.name} custom={i} variants={navLinkVariants} initial="hidden" animate="visible">
                      <Link
                        href={link.href}
                        className={`text-3xl font-semibold transition-colors duration-200 ${
                          isActive ? 'text-[#ef7464]' : 'text-gray-800 hover:text-[#ef7464]'
                        }`}
                        onClick={() => setMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              {!loading && !user && (
                <motion.div
                  className="mt-16 flex w-full max-w-[280px] flex-col gap-4 px-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, ease: 'easeOut' }}
                >
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full justify-center rounded-full border border-gray-400 py-3 font-medium text-gray-700 transition-colors hover:border-gray-900 hover:text-gray-900"
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full justify-center rounded-full bg-[#ef7464] py-3 font-semibold text-white transition-transform hover:scale-105"
                  >
                    Kayıt Ol
                  </Link>
                </motion.div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
