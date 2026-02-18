import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { getWhatsAppLink } from '@/lib/whatsappLink';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const stockBadge = {
    in_stock: { text: 'In Stock', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
    low_stock: { text: 'Low Stock', icon: AlertCircle, color: 'bg-yellow-100 text-yellow-800' },
    out_of_stock: { text: 'Out of Stock', icon: AlertCircle, color: 'bg-red-100 text-red-800' },
  };

  const badge = stockBadge[product.stock_status];
  const BadgeIcon = badge.icon;

  const whatsappMessage = `Hello, I want to order ${product.name} for my ${product.car_brand} ${product.car_model}`;
  const whatsappLink = getWhatsAppLink(whatsappMessage);

  // High-quality generic placeholder for products without images
  const placeholderUrl =
    'https://images.pexels.com/photos/4489733/pexels-photo-4489733.jpeg?auto=compress&cs=tinysrgb&w=800';

  const imageSrc = product.image_url || placeholderUrl;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-gray-200">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
            <BadgeIcon size={14} className="mr-1" />
            {badge.text}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2">
          {product.car_brand} {product.car_model}
        </p>
        <p className="text-xs text-gray-500 mb-3 capitalize">{product.category}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary-600">
            RWF {product.price.toLocaleString()}
          </span>
        </div>

        <div className="mt-4 space-y-2">
          <Link
            href={`/products/${product.id}`}
            className="block w-full text-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            View Details
          </Link>
          {product.stock_status !== 'out_of_stock' && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Order via WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
