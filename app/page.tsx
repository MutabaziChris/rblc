import Link from 'next/link';
import { Search, Package, Wrench, TrendingUp } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/lib/supabaseClient';
import { Product } from '@/types';

// Force dynamic rendering so homepage data is always fresh
export const dynamic = 'force-dynamic';

async function getFeaturedProducts(): Promise<Product[]> {
  // First try to get explicitly featured products
  const { data: featured, error: featuredError } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .order('updated_at', { ascending: false })
    .limit(8);

  if (featuredError) {
    console.error('Error fetching featured products:', featuredError);
  }

  if (featured && featured.length > 0) {
    return featured;
  }

  // Fallback: latest in-stock products if no featured set
  const { data: fallback, error: fallbackError } = await supabase
    .from('products')
    .select('*')
    .eq('stock_status', 'in_stock')
    .order('updated_at', { ascending: false })
    .limit(8);

  if (fallbackError) {
    console.error('Error fetching fallback products:', fallbackError);
    return [];
  }

  return fallback || [];
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  const categories = [
    { name: 'Engine Parts', icon: '🔧', count: 15 },
    { name: 'Brakes', icon: '🛑', count: 12 },
    { name: 'Suspension', icon: '⚙️', count: 10 },
    { name: 'Electrical', icon: '⚡', count: 18 },
    { name: 'Body Parts', icon: '🚗', count: 8 },
    { name: 'Accessories', icon: '🎁', count: 20 },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Car Parts for Your Vehicle
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Quality spare parts delivered fast across Rwanda
            </p>

            {/* Search Bar - form passes search term to /products */}
            <div className="max-w-2xl mx-auto w-full px-2 sm:px-0">
              <form action="/products" method="GET" className="w-full">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-lg shadow-lg p-2 sm:p-2 gap-2 sm:gap-0">
                  <div className="flex flex-1 items-center min-w-0">
                    <Search className="text-gray-400 ml-2 sm:ml-4 flex-shrink-0" size={20} />
                    <input
                      type="text"
                      name="search"
                      placeholder="Search by car brand, model, or part name..."
                      className="flex-1 min-w-0 px-3 sm:px-4 py-2 sm:py-3 text-gray-900 focus:outline-none text-base"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-primary-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-md hover:bg-primary-700 transition-colors font-medium whitespace-nowrap"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/products?category=${encodeURIComponent(category.name)}`}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
              >
                <div className="text-4xl mb-2">{category.icon}</div>
                <h3 className="font-semibold mb-1">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.count} items</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link
              href="/products"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose RBLC ltd?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Package className="text-primary-600 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
              <p className="text-gray-600">
                Thousands of genuine and quality parts for all major car brands
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Wrench className="text-primary-600 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-semibold mb-2">Trusted Mechanics</h3>
              <p className="text-gray-600">
                Connect with verified mechanics for installation and repairs
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <TrendingUp className="text-primary-600 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Quick delivery across Rwanda with real-time tracking
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
