import MechanicCard from '@/components/MechanicCard';
import { supabase } from '@/lib/supabaseClient';
import { Mechanic } from '@/types';
import Link from 'next/link';
import { Plus } from 'lucide-react';

async function getMechanics(): Promise<Mechanic[]> {
  const { data, error } = await supabase
    .from('mechanics')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching mechanics:', error);
    return [];
  }

  return data || [];
}

export default async function MechanicsPage() {
  const mechanics = await getMechanics();

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-4">Verified Mechanics</h1>
            <p className="text-gray-600">
              Connect with trusted mechanics for installation and repair services
            </p>
          </div>
          <Link
            href="/mechanics/register"
            className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors"
          >
            <Plus size={20} />
            <span>Register as Mechanic</span>
          </Link>
        </div>

        {mechanics.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No mechanics found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mechanics.map((mechanic) => (
              <MechanicCard key={mechanic.id} mechanic={mechanic} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
