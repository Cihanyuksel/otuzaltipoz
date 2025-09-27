import Image from 'next/image';
import { User } from 'types/auth';
import Button from '../common/button';

interface IProfileHeader {
  user: User;
  imageUrl: string;
  isOwner: boolean;
  onDeleteAccountClick?: () => void;
}

const ProfileHeader = ({ user, imageUrl, isOwner, onDeleteAccountClick }: IProfileHeader) => {
  return (
    <div className="relative flex flex-col items-center gap-6 md:flex-row md:gap-12">
      <div className="flex flex-col items-center gap-6 md:flex-row md:gap-12">
        <div className="h-32 w-32 flex-shrink-0 rounded-full overflow-hidden">
          <Image src={imageUrl} alt="Profile" width={128} height={128} className="object-cover" />
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold">{user.full_name}</h1>
          <p className="text-md font-bold text-[#ef7464]">@{user.username}</p>
          {isOwner && (
            <p className="mt-2 text-base text-[#1b160e]">
              Hesap durumu: {user.is_active ? 'Aktif' : 'Pasif'}
            </p>
          )}
        </div>
      </div>

      {isOwner && (
        <Button
          onClick={onDeleteAccountClick}
          className="absolute top-0 right-0 px-4 py-2"
          variant="danger"
        >
          Hesabı Sil
        </Button>
      )}
    </div>
  );
};

export default ProfileHeader;
