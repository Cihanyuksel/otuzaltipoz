import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "lib/config";

type Category = {
  _id: string;
  name: string;
};

export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get<{ data: Category[] }>(`${API_BASE_URL}/categories`);
        const data = response.data.data || [];
        setCategories(data.map((cat) => cat.name));
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
