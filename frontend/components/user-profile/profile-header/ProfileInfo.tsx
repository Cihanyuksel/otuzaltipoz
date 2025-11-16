import Image from 'next/image';

interface IProfileInfo {
  profileOwner: {
    full_name: string;
    username: string;
    bio?: string;
  };
  imageUrl: string;
}

const ProfileInfo = ({ profileOwner, imageUrl }: IProfileInfo) => (
  <div className="flex flex-col items-center gap-6 md:flex-row md:gap-12">
    <div className="h-32 w-32 flex-shrink-0 rounded-full overflow-hidden">
      <Image
        src={imageUrl}
        alt={`${profileOwner.full_name} profil resmi`}
        width={128}
        height={128}
        className="object-cover"
        priority
      />
    </div>
    <div className="text-center md:text-left">
      <h1 className="text-3xl font-bold">{profileOwner.full_name}</h1>
      <p className="text-md font-bold text-[#ef7464]">@{profileOwner.username}</p>
      {profileOwner.bio && <p className="mt-2 text-base text-gray-500">{profileOwner.bio}</p>}
    </div>
  </div>
);

export default ProfileInfo;
