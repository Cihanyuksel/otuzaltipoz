import { useState, useRef, useCallback, useEffect } from 'react';
import { IoIosArrowDown as ArrowDown } from 'react-icons/io';
import { useCategories } from '@/hooks/api/useCategories';
import { useOutsideClick } from '@/hooks/ui/useOutsideClick';

interface ICategoryDropdown {
  selectedCategories: string[];
  onCategoryToggle: (categoryId: string) => void;
  onError?: (message: string) => void;
}

function CategoryDropdown({ selectedCategories, onCategoryToggle, onError }: ICategoryDropdown) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    categories,
    isLoading: loadingCategories,
    error: categoryError,
  } = useCategories({
    returnType: 'full',
  });

  const closeDropdown = useCallback(() => {
    setIsDropdownOpen(false);
  }, []);

  useOutsideClick(dropdownRef, closeDropdown, isDropdownOpen);

  useEffect(() => {
    if (categoryError && onError) {
      onError('Kategoriler yüklenirken bir hata oluştu.');
    }
  }, [categoryError, onError]);

  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleCategoryClick = (categoryId: string) => {
    if (!selectedCategories.includes(categoryId) && selectedCategories.length >= 3) {
      if (onError) {
        onError('En fazla 3 kategori seçebilirsiniz');
      }
      return;
    }
    onCategoryToggle(categoryId);
  };

  const getSelectedCategoryNames = () => {
    return selectedCategories
      .map((id) => {
        const category = categories.find((c) => c._id === id);
        return category ? category.name : 'Bilinmeyen Kategori';
      })
      .join(' | ');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block pb-1 text-sm font-medium text-[#1b140e]">Kategoriler (1-3 adet)</label>
      <button
        type="button"
        onClick={handleDropdownToggle}
        disabled={loadingCategories}
        className={`
          flex h-12 w-full items-center justify-between rounded-lg border-none bg-[#f5f1ea] p-4 text-base text-[#1b140e]
          focus:outline-none transition-all duration-150 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60
          ${isDropdownOpen ? 'rounded-b-none' : ''}
        `}
      >
        <span className={`truncate ${selectedCategories.length === 0 ? 'text-gray-500' : 'text-[#1b140e]'}`}>
          {loadingCategories
            ? 'Kategoriler yükleniyor...'
            : selectedCategories.length > 0
              ? getSelectedCategoryNames()
              : 'Kategori Seçin'}
        </span>
        <ArrowDown
          className={`ml-2 h-5 w-5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
        />
      </button>

      {isDropdownOpen && !loadingCategories && (
        <div className="absolute z-10 w-full rounded-b-lg border border-t-0 border-gray-300 bg-white shadow-lg max-h-60 overflow-y-auto">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div
                key={category._id}
                onClick={() => handleCategoryClick(category._id)}
                className={`
                  flex justify-between items-center px-4 py-3 cursor-pointer text-[#1b140e] transition-colors
                  hover:bg-[#f5f1ea] text-sm
                  ${selectedCategories.includes(category._id) ? 'bg-[#ef74641a] font-semibold' : ''}
                `}
              >
                {category.name}
                {selectedCategories.includes(category._id) && <span className="text-[#ef7464]">✓</span>}
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-center text-gray-500 text-sm">Kategori bulunamadı.</div>
          )}
        </div>
      )}

      <p className="mt-3 text-xs text-gray-600">Seçili: {selectedCategories.length}/3</p>
    </div>
  );
}

export default CategoryDropdown;
