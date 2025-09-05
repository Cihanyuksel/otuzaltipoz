import Image from 'next/image';
import React from 'react';

export interface IUploaderInfo {
  _id: string;
  username: string;
  email: string;
  profile_img_url?: string; 
  created_at: string; 
}

  
export default function UploaderInfo({ user }: { user: IUploaderInfo }) {
  console.log("USERRRRRRRRRRRRR", user)
  return (
    <div className="mt-6 flex items-center gap-3">
      <div className="relative h-12 w-12 rounded-full overflow-hidden">
        <Image
          src={user.profile_img_url || "/no_profile.png"}
          alt={user.username}
          fill
          className="object-cover object-center"
        />
      </div>
      <div>
        <p className="font-semibold text-gray-900">{user.username}</p>
        <p className="text-sm text-gray-500">
          Uploaded on {new Date(user.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

