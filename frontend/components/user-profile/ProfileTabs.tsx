import { memo } from 'react';

interface IProfileTabs {
  activeTab: 'uploaded' | 'liked';
  handleTabChange: (tab: 'uploaded' | 'liked') => void;
}

const ProfileTabs = memo(({ activeTab, handleTabChange }: IProfileTabs) => {
  return (
    <div className="border-b border-[#d3deda]">
      <nav className="-mb-px flex space-x-8">
        <a
          onClick={() => handleTabChange('uploaded')}
          className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-semibold cursor-pointer ${
            activeTab === 'uploaded'
              ? 'border-[#ef7464] text-[#ef7464]'
              : 'border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-500'
          }`}
        >
          Yüklenenler
        </a>
        <a
          onClick={() => handleTabChange('liked')}
          className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium cursor-pointer ${
            activeTab === 'liked'
              ? 'border-[#ef7464] text-[#ef7464]'
              : 'border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-500'
          }`}
        >
          Beğenilenler
        </a>
      </nav>
    </div>
  );
});

export default ProfileTabs;
