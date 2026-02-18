import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { Product } from '@/types';
import { getWhatsAppLink } from '@/lib/whatsappLink';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import AIChatBox from '@/components/AIChatBox';
import ProductImageGallery from '@/components/ProductImageGallery';

// Force dynamic rendering so product details are always fresh
export const dynamic = 'force-dynamic';

async function getProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  const stockBadge = {
    in_stock: { text: 'In Stock', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
    low_stock: { text: 'Low Stock', icon: AlertCircle, color: 'bg-yellow-100 text-yellow-800' },
    out_of_stock: { text: 'Out of Stock', icon: XCircle, color: 'bg-red-100 text-red-800' },
  };

  const badge = stockBadge[product.stock_status];
  const BadgeIcon = badge.icon;

  const whatsappMessage = `Hello, I want to order ${product.name} for my ${product.car_brand} ${product.car_model}`;
  const whatsappLink = getWhatsAppLink(whatsappMessage);

  const images =
    (product.image_urls && product.image_urls.length > 0)
      ? product.image_urls
      : product.image_url
        ? [product.image_url]
        : [];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image Gallery */}
          <ProductImageGallery images={images} alt={product.name} />

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
                  <BadgeIcon size={16} className="mr-1" />
                  {badge.text}
                </span>
              </div>
              <p className="text-xl text-gray-600 mb-2">
                {product.car_brand} {product.car_model}
              </p>
              <p className="text-sm text-gray-500 capitalize mb-4">{product.category}</p>
              <p className="text-4xl font-bold text-primary-600 mb-6">
                RWF {product.price.toLocaleString()}
              </p>
            </div>

            {product.description && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-gray-700">{product.description}</p>
              </div>
            )}

            <div className="space-y-3">
              {product.stock_status !== 'out_of_stock' && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-semibold"
                >
                  Order via WhatsApp
                </a>
              )}
              <Link
                href="/request"
                className="block w-full text-center px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-semibold"
              >
                Request Part Form
              </Link>
            </div>
          </div>
        </div>

        {/* AI Assistant Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Need Help? Ask Our AI Assistant</h2>
          <div className="h-96">
            <AIChatBox />
          </div>
        </div>
      </div>
    </div>
  );
}
