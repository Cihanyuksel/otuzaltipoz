import { formatDateLong } from 'lib/formatDate';
import Image from 'next/image';
import Link from 'next/link';

export interface UploaderInfo {
  _id: string;
  username: string;
  email: string;
  profile_img_url?: string;
  created_at: string;
}

interface IUploaderInfo {
  user: UploaderInfo;
  photoCreatedAt: Date;
  photoUpdatedAt?: Date;
}

export default function UploaderInfo({ user, photoCreatedAt, photoUpdatedAt }: IUploaderInfo) {
  const createdTime = new Date(photoCreatedAt).getTime();
  const updatedTime = photoUpdatedAt ? new Date(photoUpdatedAt).getTime() : createdTime;

  const isEdited = updatedTime - createdTime > 5000;

  const displayDate = isEdited ? photoUpdatedAt! : photoCreatedAt;
  const dateLabel = isEdited ? 'Düzenleme Tarihi' : 'Yüklenme Tarihi';

  return (
    <Link href={`/biri/${user._id}`} className="flex mt-5 items-center gap-2 hover:opacity-80 transition">
      <div className="relative h-8 w-8 md:h-12 md:w-12 rounded-full overflow-hidden">
        <Image
          src={user.profile_img_url || '/no_profile.png'}
          alt={user.username}
          fill
          className="object-cover object-center"
        />
      </div>
      <div>
        <p className="font-semibold text-sm lg:text-md text-gray-900">{user.username}</p>
        <p className="text-xs  text-gray-500">
          <span className='hidden md:flex text-xs'>{dateLabel}:</span>
          {formatDateLong(displayDate)}
        </p>
      </div>
    </Link>
  );
}
