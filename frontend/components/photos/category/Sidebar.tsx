'use client';
import { IoIosClose as CloseIcon } from 'react-icons/io';
import { FiMenu as MenuIcon } from 'react-icons/fi';
import { CategorySection } from './CategorySection';
import {
  Section,
  CategorySection as CategorySectionType,
  NavigationSection as NavigationSectionType,
} from './SectionConfig';
import { NavigationSection } from './NavigationSection';

interface ISidebar {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (value: boolean) => void;
  categorySection: Section[];
  openSections: Record<string, boolean>;
  handleSectionToggle: (title: string) => void;
  selectedCategories: string[];
  handleCategoryClick: (categoryName: string) => void;
  handleRemoveCategory: (categoryName: string) => void;
  MAX_CATEGORIES: number;
}

function isCategorySection(section: Section): section is CategorySectionType {
  return section.type === 'category';
}

function isNavigationSection(section: Section): section is NavigationSectionType {
  return section.type === 'navigation';
}

export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  categorySection,
  openSections,
  handleSectionToggle,
  selectedCategories,
  handleCategoryClick,
  handleRemoveCategory,
  MAX_CATEGORIES,
}: ISidebar) {
  return (
    <aside
      className={`
        hidden lg:block md:sticky top-0 self-start h-screen overflow-y-auto
        bg-white /* Arka planı netleştirdik */
        border-r border-gray-200 /* Sınır çizgisini biraz daha görünür yaptık */
        transition-all  
        ${isSidebarOpen ? 'w-1/6 p-5' : 'w-[90px] py-6 px-2 items-center'}
      `}
    >
      <div
        className={`
          flex items-center transition-all duration-300 
          pb-5 border-b border-gray-200 /* YENİ: Alt boşluk ve ayırıcı çizgi */
          mb-6 /* Yeni boşluk ayarı */
          ${isSidebarOpen ? 'justify-between' : 'justify-center flex-col gap-4'}
        `}
      >
        {isSidebarOpen
          ? selectedCategories.length > 0 && (
              <span className="bg-[#ef7464]/10 text-[#ef7464] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border border-[#ef7464]/20">
                {selectedCategories.length}/{MAX_CATEGORIES}
              </span>
            )
          : selectedCategories.length > 0 && (
              <span className="bg-[#ef7464] text-white text-[10px] font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-md animate-in zoom-in duration-300">
                {selectedCategories.length}
              </span>
            )}

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-[#ef7464] transition-all duration-300 outline-none focus:ring-2 focus:ring-orange-100 cursor-pointer"
          aria-label={isSidebarOpen ? "Sidebar'ı kapat" : "Sidebar'ı aç"}
        >
          {isSidebarOpen ? <CloseIcon size={28} /> : <MenuIcon size={22} />}
        </button>
      </div>

      {isSidebarOpen && selectedCategories.length > 0 && (
        <div className="pb-6 border-b border-gray-200 mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto custom-scrollbar p-1">
            {selectedCategories.map((category) => (
              <div
                key={category}
                className="group flex items-center gap-1.5 pl-3 pr-1 py-1 bg-[#ef7464]/5 border border-[#ef7464]/20 text-[#ef7464] text-xs font-semibold rounded-lg transition-all hover:bg-[#ef7464]/10 hover:shadow-sm"
              >
                <span className="truncate max-w-[120px]">{category}</span>
                <button
                  onClick={() => handleRemoveCategory(category)}
                  className="p-0.5 rounded-md hover:bg-[#ef7464] hover:text-white text-[#ef7464]/70 transition-colors flex-shrink-0"
                  aria-label={`${category} kategorisini kaldır`}
                >
                  <CloseIcon size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        className={`
          transition-all duration-300 
          ${!isSidebarOpen && 'flex flex-col items-center'}
          ${isSidebarOpen && selectedCategories.length === 0 && 'pt-1'} /* Çipler yokken boşluk olmasın diye ayar */
        `}
      >
        <ul className="space-y-2">
          {categorySection.map((section) => {
            if (isCategorySection(section)) {
              return (
                <CategorySection
                  key={section.title}
                  title={section.title}
                  items={section.items}
                  isOpen={openSections[section.title] || false}
                  onToggle={() => handleSectionToggle(section.title)}
                  isSidebarOpen={isSidebarOpen}
                  iconName={section.iconName}
                  onCategoryClick={handleCategoryClick}
                  selectedCategories={selectedCategories}
                  onRemoveCategory={handleRemoveCategory}
                />
              );
            } else if (isNavigationSection(section)) {
              return (
                <NavigationSection
                  key={section.title}
                  title={section.title}
                  items={section.items}
                  isOpen={openSections[section.title] || false}
                  onToggle={() => handleSectionToggle(section.title)}
                  isSidebarOpen={isSidebarOpen}
                  iconName={section.iconName}
                />
              );
            }
            return null;
          })}
        </ul>
      </div>
    </aside>
  );
}
