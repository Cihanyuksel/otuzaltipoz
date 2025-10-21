import { API_BASE_URL } from 'lib/config';
import { useEffect, useState } from 'react';

export interface Category {
  _id: string;
  name: string;
}

export function useCategories(options: { returnType: 'full' }): {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
};
export function useCategories(options?: { returnType?: 'names' }): {
  categories: string[];
  isLoading: boolean;
  error: string | null;
};

export function useCategories(options: { returnType?: 'names' | 'full' } = { returnType: 'names' }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/categories`);

        if (!response.ok) {
          throw new Error('Kategoriler yüklenemedi');
        }

        const rawData = await response.json();
        const data = rawData.data || rawData.categories || rawData;

        const categoriesArray = Array.isArray(data) ? data : [];
        setCategories(categoriesArray);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Kategori API hatası';
        console.error('Kategori API hatası:', err);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (options.returnType === 'full') {
    return { categories, isLoading, error };
  }

  return {
    categories: categories.map((cat) => cat.name),
    isLoading,
    error,
  };
}
