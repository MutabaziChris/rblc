import { Supplier } from '@/types';
import { MapPin, Phone, Mail, Star } from 'lucide-react';

interface SupplierCardProps {
  supplier: Supplier;
}

export default function SupplierCard({ supplier }: SupplierCardProps) {
  const trustScorePercentage = Math.round(supplier.trust_score * 100);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold">{supplier.supplier_name}</h3>
        <div className="flex items-center space-x-1">
          <Star className="text-yellow-400 fill-current" size={20} />
          <span className="font-semibold">{trustScorePercentage}%</span>
        </div>
      </div>

      <p className="text-gray-600 mb-4">{supplier.specialization}</p>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <MapPin size={16} className="text-gray-400" />
          <span>{supplier.location}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Phone size={16} className="text-gray-400" />
          <a href={`tel:${supplier.phone}`} className="hover:text-primary-600">
            {supplier.phone}
          </a>
        </div>
        {supplier.email && (
          <div className="flex items-center space-x-2">
            <Mail size={16} className="text-gray-400" />
            <a href={`mailto:${supplier.email}`} className="hover:text-primary-600">
              {supplier.email}
            </a>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Trust Score</span>
          <div className="flex-1 mx-2 bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all"
              style={{ width: `${trustScorePercentage}%` }}
            />
          </div>
          <span className="text-gray-600">{trustScorePercentage}%</span>
        </div>
      </div>
    </div>
  );
}
