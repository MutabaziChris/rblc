import { Suspense } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import ProductsFilter from '@/components/ProductsFilter';
import { supabase } from '@/lib/supabaseClient';
import { Product } from '@/types';

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

        {/* Filters - auto-apply on change (search debounced 400ms) */}
        <Suspense fallback={<div className="bg-white rounded-lg shadow-md p-6 mb-8 animate-pulse h-24" />}>
          <ProductsFilter
          categories={categories}
          brands={brands}
          initialSearch={params.search ?? ''}
          initialCategory={resolvedCategory}
          initialBrand={params.brand ?? ''}
          />
        </Suspense>

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
