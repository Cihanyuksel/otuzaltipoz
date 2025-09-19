import Image from 'next/image';
import { FaRegComments as CommentIcon } from "react-icons/fa";

export default function CommentSection({ userPhoto }: { userPhoto: string | undefined }) {
  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      <div className="flex items-start  gap-4">
        <Image
          src={userPhoto || '/no_profile.png'}
          alt="Kullanıcı Profil Resmi"
          width={40}
          height={40}
          className="h-15 w-15 object-cover flex-shrink-0 rounded-full"
        />
        <div className="w-full">
          <textarea
            className="form-textarea w-full p-2 rounded-md border-gray-300 bg-gray-100 text-sm focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
            placeholder="Yorum ekle..."
            rows={3}
          ></textarea>
          <button className="mt-1 rounded-lg border-gray-200 border h-10 px-6 text-xs md:text-sm font-medium text-blue-500 transition-colors hover:bg-gray-100 cursor-pointer flex items-center gap-2">
          <CommentIcon />

            Yorum Yap
          </button>
        </div>
      </div>
    </div>
  );
}
