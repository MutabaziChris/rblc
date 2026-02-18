'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Search } from 'lucide-react';

interface ProductsFilterProps {
  categories: string[];
  brands: string[];
  initialSearch: string;
  initialCategory: string;
  initialBrand: string;
}

/** Debounce delay for search input (ms) */
const SEARCH_DEBOUNCE_MS = 400;

export default function ProductsFilter({
  categories,
  brands,
  initialSearch,
  initialCategory,
  initialBrand,
}: ProductsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(initialSearch);

  // Sync local search when URL changes (e.g. Clear filters)
  useEffect(() => {
    setSearchValue(initialSearch);
  }, [initialSearch]);

  const applyFilters = useCallback(
    (updates: { search?: string; category?: string; brand?: string }) => {
      const params = new URLSearchParams(searchParams.toString());
      if (updates.search !== undefined) {
        if (updates.search) params.set('search', updates.search);
        else params.delete('search');
      }
      if (updates.category !== undefined) {
        if (updates.category) params.set('category', updates.category);
        else params.delete('category');
      }
      if (updates.brand !== undefined) {
        if (updates.brand) params.set('brand', updates.brand);
        else params.delete('brand');
      }
      const query = params.toString();
      router.replace(query ? `/products?${query}` : '/products');
    },
    [router, searchParams]
  );

  // Apply search when user stops typing (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== initialSearch) {
        applyFilters({ search: searchValue });
      }
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchValue, initialSearch, applyFilters]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    applyFilters({ category: e.target.value });
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    applyFilters({ brand: e.target.value });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              id="search"
              type="text"
              placeholder="Search products..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            id="category"
            value={initialCategory}
            onChange={handleCategoryChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
            Car Brand
          </label>
          <select
            id="brand"
            value={initialBrand}
            onChange={handleBrandChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Brands</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <a
            href="/products"
            className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-center text-sm font-medium text-gray-700"
          >
            Clear filters
          </a>
        </div>
      </div>
    </div>
  );
}
