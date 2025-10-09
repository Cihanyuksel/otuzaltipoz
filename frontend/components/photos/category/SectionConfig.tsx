import { FiLayers as CategoriesIcon, FiUsers as UsersIcon, FiNavigation as ExploreIcon } from "react-icons/fi";

export const getSections = (categories: string[]) => [
  {
    title: "Kategoriler",
    icon: <CategoriesIcon className="text-[#ef7464] hover:text-[#ef7464]/60" />,
    items: categories,
  },
  {
    title: "Keşfet",
    icon: <ExploreIcon className="text-[#ef7464] hover:text-[#ef7464]/60" />,
    items: ["Popüler Fotoğraflar", "Editörün Seçtikleri", "Yeni Yüklenenler"],
  },
  {
    title: "Topluluk",
    icon: <UsersIcon className="text-[#ef7464] hover:text-[#ef7464]/60" />,
    items: ["Fotoğrafçılar", "Tartışmalar"],
  },
];
