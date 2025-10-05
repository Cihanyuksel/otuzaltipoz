import { FiLayers as CategoriesIcon, FiUsers as UsersIcon, FiNavigation as ExploreIcon } from "react-icons/fi";

export const getSections = (categories: string[]) => [
  {
    title: "Kategoriler",
    icon: <CategoriesIcon />,
    items: categories,
  },
  {
    title: "Keşfet",
    icon: <ExploreIcon />,
    items: ["Popüler Fotoğraflar", "Editörün Seçtikleri", "Yeni Yüklenenler"],
  },
  {
    title: "Topluluk",
    icon: <UsersIcon />,
    items: ["Fotoğrafçılar", "Tartışmalar"],
  },
];
