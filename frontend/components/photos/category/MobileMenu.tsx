import { CategorySection } from './CategorySection';

interface MobileMenuProps {
  isMobileMenuOpen: boolean;
  categorySection: { title: string; icon: React.ReactNode; items: string[] }[];
  openSections: { [key: string]: boolean };
  handleSectionToggle: (title: string) => void;
  selectedCategories: string[];
  handleCategoryClick: (categoryName: string) => void;
  handleRemoveCategory: (categoryName: string) => void;
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
        md:hidden 
        bg-white border-b border-gray-200 
        overflow-hidden 
        transition-all duration-300 ease-in-out
        ${isMobileMenuOpen ? 'h-auto opacity-100 p-4' : 'h-0 opacity-0 p-0'}
      `}
    >
      <ul className="space-y-2">
        {categorySection.map((section) => (
          <CategorySection
            key={section.title}
            title={section.title}
            items={section.items}
            isOpen={openSections[section.title] || false}
            onToggle={() => handleSectionToggle(section.title)}
            isSidebarOpen={true}
            icon={section.icon}
            onCategoryClick={handleCategoryClick}
            selectedCategories={selectedCategories}
            onRemoveCategory={handleRemoveCategory}
          />
        ))}
      </ul>
    </div>
  );
}
