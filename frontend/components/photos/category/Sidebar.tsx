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
    <div
      className={`
        hidden top-20 lg:block md:sticky md:top-0 2xl:top-44 md:self-start md:h-screen md:overflow-y-auto
        bg-white border-r border-gray-200 shadow-xl shadow-gray-200/50 
        transition-all duration-300 ease-in-out z-20 
        ${isSidebarOpen ? 'w-1/6 p-4' : 'w-[100px] pt-5'}
      `}
    >
      <div
        className={`flex items-center mb-6 transition-all duration-300 ${
          isSidebarOpen ? 'justify-between' : 'justify-center'
        }`}
      >
        {isSidebarOpen && selectedCategories.length > 0 && (
          <span className="bg-[#ef7464] text-white text-xs font-medium tracking-wider px-3 py-1.5 rounded-md shadow-md">
            {selectedCategories.length}/{MAX_CATEGORIES}
          </span>
        )}

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="cursor-pointer p-1 hover:opacity-70 transition-opacity"
          aria-label={isSidebarOpen ? "Sidebar'ı kapat" : "Sidebar'ı aç"}
        >
          {isSidebarOpen ? (
            <CloseIcon size={32} className="text-[#ef7464]" />
          ) : (
            <MenuIcon size={20} className="text-gray-500" />
          )}
        </button>
      </div>

      {isSidebarOpen && selectedCategories.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2 p-2 bg-gray-100 rounded-lg max-h-24 overflow-y-auto">
          {selectedCategories.map((category) => (
            <div
              key={category}
              className="flex items-center bg-[#ef7464] text-white text-xs px-2 py-1 rounded-full shadow-sm"
            >
              <span className="truncate max-w-[120px]">{category}</span>
              <button
                onClick={() => handleRemoveCategory(category)}
                className="ml-1 text-white hover:text-gray-100 transition flex-shrink-0"
                aria-label={`${category} kategorisini kaldır`}
              >
                <CloseIcon size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="overflow-y-auto transition-all duration-300">
        <ul className="space-y-1">
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
    </div>
  );
}
