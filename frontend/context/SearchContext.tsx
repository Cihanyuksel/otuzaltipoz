import { createContext, useContext, useState, ReactNode } from 'react';

interface SearchContextType {
  setSearchValue: (val: string) => void;
  searchValue: string;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchValue, setSearchValue] = useState('');

  return <SearchContext.Provider value={{ searchValue, setSearchValue }}>{children}</SearchContext.Provider>;
}

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
