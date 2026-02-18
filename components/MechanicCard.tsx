import { Mechanic } from '@/types';
import { MapPin, Phone, Mail, Wrench } from 'lucide-react';

interface MechanicCardProps {
  mechanic: Mechanic;
}

export default function MechanicCard({ mechanic }: MechanicCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4 mb-4">
        <div className="bg-primary-100 p-3 rounded-full">
          <Wrench className="text-primary-600" size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold">{mechanic.name}</h3>
          <p className="text-gray-600">{mechanic.garage_name}</p>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex items-center space-x-2">
          <MapPin size={16} className="text-gray-400" />
          <span>{mechanic.location}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Phone size={16} className="text-gray-400" />
          <a href={`tel:${mechanic.phone}`} className="hover:text-primary-600">
            {mechanic.phone}
          </a>
        </div>
        {mechanic.email && (
          <div className="flex items-center space-x-2">
            <Mail size={16} className="text-gray-400" />
            <a href={`mailto:${mechanic.email}`} className="hover:text-primary-600">
              {mechanic.email}
            </a>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Referral Code</span>
          <span className="font-mono font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded">
            {mechanic.referral_code}
          </span>
        </div>
      </div>
    </div>
  );
}
