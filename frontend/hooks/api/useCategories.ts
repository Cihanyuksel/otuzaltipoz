import { useEffect, useState } from "react";

export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/v1/categories');
        const rawData = await response.json();
        const data = rawData.data || rawData.categories || rawData;
        setCategories(Array.isArray(data) ? data.map((cat: any) => cat.name) : []);
      } catch (err) {
        console.error("Kategori API hatası:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, isLoading };
};
