import React from 'react';
import Image from 'next/image';

export default function CommentSection({ userPhoto }: { userPhoto: string }) {
  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      <div className="flex items-start  gap-4">
        <Image
          src={userPhoto}
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
          >
          </textarea>
          <button className="mt-1 rounded-md bg-blue-400 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-300 transition-colors cursor-pointer">
            Yorum Yap
          </button>
        </div>
      </div>
    </div>
  );
}
