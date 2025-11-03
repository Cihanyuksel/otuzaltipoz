type ActionItem =
  | {
      name: 'divider';
    }
  | {
      name: string;
      handler: () => void;
      type: 'default' | 'danger';
      disabled?: boolean;
    };

interface IProfileDropdown {
  actionItems: ActionItem[];
  isPending: boolean;
}

function ProfileDropdown({ actionItems, isPending }: IProfileDropdown) {
  return (
    <div
      className="absolute right-0 mt-2 w-60 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-10"
      role="menu"
      aria-orientation="vertical"
    >
      <div className="py-1">
        <h3 className="px-4 py-2 text-sm font-semibold text-gray-500 border-b">Hesap Yönetimi</h3>
        {actionItems.map((item, index) => {
          if (item.name === 'divider') {
            return <hr key={`divider-${index}`} className="my-1 border-gray-100" />;
          }

          const actionItem = item as Extract<ActionItem, { handler: () => void }>;
          const isDeleteAction = actionItem.name === 'Hesabı Sil';
          const isDisabled = isDeleteAction && isPending;
          const isAdminSettings = actionItem.name === 'Admin Ayarları' && actionItem.disabled;

          return (
            <button
              key={actionItem.name}
              onClick={actionItem.handler}
              className={`group flex items-center w-full px-4 py-2 text-sm text-left transition-colors cursor-pointer ${
                actionItem.type === 'danger'
                  ? 'text-red-600 hover:bg-red-50 hover:text-red-700'
                  : 'text-gray-700 hover:bg-gray-100'
              } ${isDisabled || isAdminSettings ? 'opacity-50 cursor-not-allowed line-through' : ''}`}
              disabled={isDisabled || isAdminSettings}
              role="menuitem"
            >
              {isDeleteAction && isPending ? 'Siliniyor...' : actionItem.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ProfileDropdown;
