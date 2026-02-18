'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Car, Package, Phone, User } from 'lucide-react';

export default function RequestPartPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    car_brand: '',
    car_model: '',
    requested_part: '',
    year: '',
    additional_info: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: formData.customer_name,
          customer_phone: formData.customer_phone,
          car_brand: formData.car_brand,
          car_model: formData.car_model,
          requested_part: formData.requested_part,
          year: formData.year || undefined,
          additional_info: formData.additional_info || undefined,
          profit_margin: 0.15, // 15% default margin
        }),
      });

      if (response.ok) {
        const { whatsappLink } = await response.json();
        if (whatsappLink) {
          window.open(whatsappLink, '_blank');
        }
        alert('Request submitted! Please send the WhatsApp message to complete. We will contact you soon.');
        router.push('/');
      } else {
        const error = await response.json();
        alert(`Submission failed: ${error.message}`);
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="text-primary-600" size={32} />
            </div>
            <h1 className="text-3xl font-bold mb-2">Request a Part</h1>
            <p className="text-gray-600">
              Can't find what you're looking for? Submit a request and we'll find it for you
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline mr-2" size={16} />
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline mr-2" size={16} />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.customer_phone}
                  onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                  placeholder="+250786905080"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Car className="inline mr-2" size={16} />
                Car Brand *
              </label>
              <input
                type="text"
                required
                value={formData.car_brand}
                onChange={(e) => setFormData({ ...formData, car_brand: e.target.value })}
                placeholder="e.g., Toyota, Honda, Nissan"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Car Model *
                </label>
                <input
                  type="text"
                  required
                  value={formData.car_model}
                  onChange={(e) => setFormData({ ...formData, car_model: e.target.value })}
                  placeholder="e.g., Corolla, Civic, X-Trail"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year (Optional)
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="e.g., 2020"
                  min="1990"
                  max="2024"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Package className="inline mr-2" size={16} />
                Part Needed *
              </label>
              <input
                type="text"
                required
                value={formData.requested_part}
                onChange={(e) => setFormData({ ...formData, requested_part: e.target.value })}
                placeholder="e.g., Brake pads, Air filter, Headlight assembly"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Information (Optional)
              </label>
              <textarea
                value={formData.additional_info}
                onChange={(e) => setFormData({ ...formData, additional_info: e.target.value })}
                rows={4}
                placeholder="Any additional details about the part you need..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
