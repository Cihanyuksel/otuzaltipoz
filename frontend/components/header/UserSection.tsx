import Link from "next/link"
import Image from 'next/image'
import { MdKeyboardArrowDown } from "react-icons/md"
import { motion } from 'framer-motion';
import { Dispatch, SetStateAction } from "react";
import { User } from "types/auth";


interface IUserSection {
    setDropdownOpen: Dispatch<SetStateAction<boolean>>;
    handleDropdown: () => void;
    user: User | null;
    loading: boolean;
    dropdownOpen: boolean;
    handleLogout: () => void;
  }

function UserSection({setDropdownOpen, handleDropdown, user, loading, dropdownOpen, handleLogout}: IUserSection) {
  return (
    <div>
        {!loading &&
        (user ? (
          <div className="relative flex items-center gap-4 flex-shrink-0">
            <div className="flex items-center gap-4">
              <Image
                src={user?.profile_img_url}
                alt="Profile Picture"
                width={50}
                height={50}
                className="rounded-full object-cover aspect-square"
              />
              <div className="hidden md:flex flex-col text-sm">
                <span className="font-bold text-gray-800 text-base">{user.username}</span>
                <span className="text-xs text-gray-600">User</span>
              </div>
            </div>
            <motion.button
              onClick={handleDropdown}
              className="p-1 rounded-full hover:bg-gray-200 transition-colors focus:outline-none cursor-pointer"
              animate={{ rotate: dropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <MdKeyboardArrowDown size={24} />
            </motion.button>
            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <ul className="py-1">
                  <li>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profil
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/photo-upload"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Fotoğraf Yükle
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/messages"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Mesajlar
                    </Link>
                  </li>
                  <li className="relative">
                    <Link
                      href="/notifications"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Bildirimler
                      <span className="absolute top-2 right-4 inline-flex items-center justify-center h-4 w-4 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                        1
                      </span>
                    </Link>
                  </li>
                  <li className="border-t border-gray-200 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer"
                    >
                      Çıkış Yap
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="flex space-x-5">
            <li className="list-none">
              <Link
                href="/login"
                className="px-4 py-1 border border-[#ef7464] rounded hover:bg-[#ef7464] hover:text-white transition cursor-pointer"
              >
                Giriş Yap
              </Link>
            </li>
            <li className="list-none">
              <Link
                href="/register"
                className="px-4 py-1 border border-[#ef7464] rounded hover:bg-[#ef7464] hover:text-white transition cursor-pointer"
              >
                Kayıt Ol
              </Link>
            </li>
          </div>
        ))}
    </div>
  )
}

export default UserSection
