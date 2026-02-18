'use client';

import { useState, useEffect } from 'react';
import { Mechanic } from '@/types';
import { Plus, Edit, Trash2, Wrench } from 'lucide-react';

/**
 * Admin Mechanics Management Page
 * Full CRUD operations for managing mechanics
 */
export default function AdminMechanicsPage() {
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMechanic, setEditingMechanic] = useState<Mechanic | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    garage_name: '',
    location: '',
    phone: '',
    referral_code: '',
    email: '',
  });

  useEffect(() => {
    fetchMechanics();
  }, []);

  const fetchMechanics = async () => {
    try {
      const response = await fetch('/api/mechanics');
      const data = await response.json();
      setMechanics(data.mechanics || []);
    } catch (error) {
      console.error('Error fetching mechanics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReferralCode = (name: string): string => {
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    const randomNum = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return `${initials}${randomNum}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Generate referral code if creating new mechanic
      if (!editingMechanic && !formData.referral_code) {
        formData.referral_code = generateReferralCode(formData.name);
      }

      const url = editingMechanic
        ? `/api/admin/mechanics/${editingMechanic.id}`
        : '/api/admin/mechanics';
      const method = editingMechanic ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchMechanics();
        resetForm();
        alert(editingMechanic ? 'Mechanic updated!' : 'Mechanic created!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const handleEdit = (mechanic: Mechanic) => {
    setEditingMechanic(mechanic);
    setFormData({
      name: mechanic.name,
      garage_name: mechanic.garage_name,
      location: mechanic.location,
      phone: mechanic.phone,
      referral_code: mechanic.referral_code,
      email: mechanic.email || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this mechanic?')) return;

    try {
      const response = await fetch(`/api/admin/mechanics/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchMechanics();
        alert('Mechanic deleted!');
      } else {
        alert('Error deleting mechanic');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      garage_name: '',
      location: '',
      phone: '',
      referral_code: '',
      email: '',
    });
    setEditingMechanic(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 flex items-center justify-center">
        <div className="text-center">
          <Wrench className="animate-spin mx-auto mb-4 text-primary-600" size={48} />
          <p className="text-gray-600">Loading mechanics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Mechanics</h1>
            <p className="text-gray-600">Create, edit, and delete mechanics</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors"
          >
            <Plus size={20} />
            <span>{showForm ? 'Cancel' : 'Add Mechanic'}</span>
          </button>
        </div>

        {/* Mechanic Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingMechanic ? 'Edit Mechanic' : 'Add New Mechanic'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Garage Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.garage_name}
                    onChange={(e) =>
                      setFormData({ ...formData, garage_name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Kigali, Nyarugenge"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+250786905080"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Referral Code {editingMechanic ? '*' : '(Auto-generated if empty)'}
                  </label>
                  <input
                    type="text"
                    required={!!editingMechanic}
                    value={formData.referral_code}
                    onChange={(e) =>
                      setFormData({ ...formData, referral_code: e.target.value })
                    }
                    placeholder="e.g., JB001"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
                >
                  {editingMechanic ? 'Update Mechanic' : 'Create Mechanic'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Mechanics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mechanics.map((mechanic) => (
            <div key={mechanic.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{mechanic.name}</h3>
                  <p className="text-sm text-gray-600">{mechanic.garage_name}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(mechanic)}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(mechanic.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Location:</span> {mechanic.location}
                </p>
                <p>
                  <span className="font-medium">Phone:</span> {mechanic.phone}
                </p>
                {mechanic.email && (
                  <p>
                    <span className="font-medium">Email:</span> {mechanic.email}
                  </p>
                )}
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="font-medium">Referral Code</span>
                  <span className="font-mono font-semibold text-primary-600">
                    {mechanic.referral_code}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
