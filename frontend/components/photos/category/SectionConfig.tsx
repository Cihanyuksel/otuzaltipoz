import { FiLayers as CategoriesIcon, FiUsers as UsersIcon, FiNavigation as ExploreIcon } from 'react-icons/fi';

export interface CategorySection {
  title: string;
  iconName: string;
  items: string[]; 
  type: 'category';
}

export interface NavigationSection {
  title: string;
  iconName: string;
  items: Array<{
    label: string;
    path: string;
    disabled: boolean;
  }>;
  type: 'navigation';
}

export type Section = CategorySection | NavigationSection;

export const renderIcon = (iconName: string) => {
  const iconProps = { className: 'text-[#ef7464] hover:text-[#ef7464]/60', size: 20 };

  switch (iconName) {
    case 'layers':
      return <CategoriesIcon {...iconProps} />;
    case 'navigation':
      return <ExploreIcon {...iconProps} />;
    case 'users':
      return <UsersIcon {...iconProps} />;
    default:
      return null;
  }
};

export const getSections = (categories: string[]): Section[] => [
  {
    title: 'Kategoriler',
    iconName: 'layers',
    items: categories,
    type: 'category',
  },
  {
    title: 'Keşfet',
    iconName: 'navigation',
    items: [
      { label: 'Popüler Fotoğraflar', path: '/explore/popular', disabled: true },
      { label: 'Editörün Seçtikleri', path: '/explore/editors-choice', disabled: true },
      { label: 'Yeni Yüklenenler', path: '/explore/new', disabled: true },
    ],
    type: 'navigation',
  },
  {
    title: 'Topluluk',
    iconName: 'users',
    items: [
      { label: 'Fotoğrafçılar', path: '/community/photographers', disabled: true },
      { label: 'Tartışmalar', path: '/community/discussions', disabled: true },
    ],
    type: 'navigation',
  },
];
