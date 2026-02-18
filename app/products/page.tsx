import { Suspense } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/lib/supabaseClient';
import { Product } from '@/types';
import { Search } from 'lucide-react';

// Force dynamic rendering so listing always reflects latest products
export const dynamic = 'force-dynamic';

interface ProductsPageProps {
  searchParams:
    | {
        category?: string;
        brand?: string;
        model?: string;
        search?: string;
      }
    | Promise<{
        category?: string;
        brand?: string;
        model?: string;
        search?: string;
      }>;
}

async function getProducts(
  searchParams: { category?: string; brand?: string; model?: string; search?: string }
): Promise<Product[]> {
  let query = supabase.from('products').select('*');

  const category = typeof searchParams?.category === 'string' ? searchParams.category.trim() : '';
  const brand = typeof searchParams?.brand === 'string' ? searchParams.brand.trim() : '';
  const model = typeof searchParams?.model === 'string' ? searchParams.model.trim() : '';
  const search = typeof searchParams?.search === 'string' ? searchParams.search.trim() : '';

  // Map display names from homepage to database category names
  const dbCategory = category ? (CATEGORY_DISPLAY_TO_DB[category] ?? category) : '';
  if (dbCategory) query = query.eq('category', dbCategory);
  if (brand) query = query.eq('car_brand', brand);
  if (model) query = query.eq('car_model', model);
  if (search) {
    const term = `%${search}%`;
    query = query.or(
      `name.ilike.${term},description.ilike.${term},car_brand.ilike.${term},car_model.ilike.${term}`
    );
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data || [];
}

async function getCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from('products')
    .select('category')
    .order('category');

  if (error || !data) return [];
  const uniqueCategories = Array.from(new Set(data.map((p) => p.category)));
  return uniqueCategories;
}

async function getBrands(): Promise<string[]> {
  const { data, error } = await supabase
    .from('products')
    .select('car_brand')
    .order('car_brand');

  if (error || !data) return [];
  const uniqueBrands = Array.from(new Set(data.map((p) => p.car_brand)));
  return uniqueBrands;
}

const CATEGORY_DISPLAY_TO_DB: Record<string, string> = {
  'Engine Parts': 'Engine',
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await Promise.resolve(searchParams).then((p) => p ?? {});
  const products = await getProducts(params);
  const categories = await getCategories();
  const brands = await getBrands();

  // Resolve category for form display (e.g. "Engine Parts" from homepage → "Engine" from DB)
  const resolvedCategory =
    params.category && typeof params.category === 'string'
      ? (CATEGORY_DISPLAY_TO_DB[params.category.trim()] ?? params.category.trim())
      : '';

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">All Products</h1>

        {/* Filters - GET form so search + category + brand apply via URL */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form action="/products" method="GET" className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="search"
                  name="search"
                  type="text"
                  placeholder="Search products..."
                  defaultValue={params.search ?? ''}
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
                name="category"
                defaultValue={resolvedCategory}
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
                name="brand"
                defaultValue={params.brand ?? ''}
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

            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
              >
                Apply Filters
              </button>
              <a
                href="/products"
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-center text-sm font-medium text-gray-700"
              >
                Clear
              </a>
            </div>
          </form>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">No products found. Try adjusting your filters.</p>
            <p className="text-gray-600 mb-4">
              Can&apos;t find what you need? Use our{' '}
              <Link
                href="/request"
                className="text-primary-600 hover:text-primary-700 font-semibold underline"
              >
                Request Part
              </Link>
              {' '}form and we&apos;ll help you find it.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
