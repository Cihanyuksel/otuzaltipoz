import { formatDate } from 'lib/formatDate';
import Image from 'next/image';
import Link from 'next/link';

interface IPhotoCardInfo {
  photoId: string;
  title: string;
  description: string;
  uploader: string;
  profileImgUrl?: string;
  created_at: string;
}

function PhotoCardInfo({ description, created_at, uploader, profileImgUrl, photoId, title }: IPhotoCardInfo) {
  return (
    <div className="p-3 flex flex-col gap-1 bg-[#f5f1ea]">
      <div className="flex items-center justify-between gap-2 mt-1">
        <Link href={`/photos/${photoId}`} className="flex-1 min-w-0">
          <div>
            <h2 className="text-sm font-semibold truncate">{title}</h2>
            <p className="truncate">{description}</p>
          </div>
        </Link>

        <Link href={`/biri/${uploader}`} className="flex items-center gap-x-5 p-1 rounded-xl">
          <div className="flex flex-col items-end">
            <p className="text-xs text-gray-800 truncate leading-6">
              Uploaded by: <strong>{uploader}</strong>
            </p>
            <p className="text-xs text-gray-500">{formatDate(created_at)}</p>
          </div>
          <div className="flex items-center">
            <Image
              src={profileImgUrl ? profileImgUrl : '/no_profile.png'}
              alt={`${uploader} profil`}
              width={45}
              height={45}
              className="w-[45px] h-[45px] rounded-full object-cover self-center"
            />
          </div>
        </Link>
      </div>
    </div>
  );
}

export default PhotoCardInfo;
