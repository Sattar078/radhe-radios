import { useState, useEffect, useCallback, useRef } from 'react';
import { productsApi } from '../services/api';

/**
 * Hook to fetch, search, and filter products from the backend.
 * Falls back to a simple "debounced" approach so search doesn't fire on every keystroke.
 */
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All Audio Systems']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const debounceRef = useRef(null);

  const fetchProducts = useCallback(async (q, cat) => {
    setLoading(true);
    setError(null);
    try {
      const data = await productsApi.list({ search: q, category: cat });
      setProducts(data.products);
      setCategories(data.categories);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchProducts('', '');
  }, [fetchProducts]);

  // Debounced search + category filter
  const handleSearch = useCallback((value) => {
    setSearch(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchProducts(value, category);
    }, 350);
  }, [category, fetchProducts]);

  const handleCategoryChange = useCallback((cat) => {
    setCategory(cat);
    fetchProducts(search, cat);
  }, [search, fetchProducts]);

  return {
    products,
    categories,
    loading,
    error,
    search,
    category,
    setSearch: handleSearch,
    setCategory: handleCategoryChange,
    refetch: () => fetchProducts(search, category),
  };
}

