import Image from 'next/image';

interface IProfileInfo {
  user: {
    full_name: string;
    username: string;
    bio?: string;
  };
  imageUrl: string;
}

const ProfileInfo = ({ user, imageUrl }: IProfileInfo) => (
  <div className="flex flex-col items-center gap-6 md:flex-row md:gap-12">
    <div className="h-32 w-32 flex-shrink-0 rounded-full overflow-hidden">
      <Image
        src={imageUrl}
        alt={`${user.full_name} profil resmi`}
        width={128}
        height={128}
        className="object-cover"
        priority
      />
    </div>
    <div className="text-center md:text-left">
      <h1 className="text-3xl font-bold">{user.full_name}</h1>
      <p className="text-md font-bold text-[#ef7464]">@{user.username}</p>
      {user.bio && <p className="mt-2 text-base text-gray-500">{user.bio}</p>}
    </div>
  </div>
);

export default ProfileInfo;
