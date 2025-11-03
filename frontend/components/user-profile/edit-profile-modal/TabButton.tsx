type TabType = 'profile' | 'username' | 'password';

interface Tab {
  key: TabType;
  label: string;
}

interface ITabButton {
  tabs: Tab[];
  isPending: boolean;
  setActiveTab: (key: TabType) => void;
  activeTab: TabType;
}

function TabButton({ tabs, isPending, setActiveTab, activeTab }: ITabButton) {
  return (
    <div className="flex border-b border-b-gray-100">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => setActiveTab(tab.key)}
          disabled={isPending}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === tab.key ? 'text-[#ef7464] border-b-2 border-[#ef7464]' : 'text-gray-500 hover:text-gray-700'
          } ${isPending ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default TabButton;
