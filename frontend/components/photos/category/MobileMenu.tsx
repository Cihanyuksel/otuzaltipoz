'use client';
import { CategorySection } from './CategorySection';
import { NavigationSection } from './NavigationSection';
import {
  Section,
  CategorySection as CategorySectionType,
  NavigationSection as NavigationSectionType,
} from './SectionConfig';

interface MobileMenuProps {
  isMobileMenuOpen: boolean;
  categorySection: Section[];
  openSections: { [key: string]: boolean };
  handleSectionToggle: (title: string) => void;
  selectedCategories: string[];
  handleCategoryClick: (categoryName: string) => void;
  handleRemoveCategory: (categoryName: string) => void;
}

function isCategorySection(section: Section): section is CategorySectionType {
  return section.type === 'category';
}

function isNavigationSection(section: Section): section is NavigationSectionType {
  return section.type === 'navigation';
}

export default function MobileMenu({
  isMobileMenuOpen,
  categorySection,
  openSections,
  handleSectionToggle,
  selectedCategories,
  handleCategoryClick,
  handleRemoveCategory,
}: MobileMenuProps) {
  return (
    <div
      className={`
        lg:hidden 
        bg-white border-b border-gray-200 
        overflow-hidden 
        transition-all duration-300 ease-in-out
        ${isMobileMenuOpen ? 'max-h-[600px] opacity-100 p-4' : 'max-h-0 opacity-0 p-0'}
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
                isSidebarOpen={true}
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
                isSidebarOpen={true}
                iconName={section.iconName}
              />
            );
          }
          return null;
        })}
      </ul>
    </div>
  );
}
