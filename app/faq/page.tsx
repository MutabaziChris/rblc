import { supabase } from '@/lib/supabaseClient';
import { FAQ } from '@/types';
import { HelpCircle } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getFAQs(): Promise<FAQ[]> {
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .order('category', { ascending: true });

  if (error) {
    console.error('Error fetching FAQs:', error);
    return [];
  }

  return Array.isArray(data) ? data : [];
}

export default async function FAQPage() {
  const faqs = await getFAQs();

  // Group FAQs by category
  const faqsByCategory = faqs.reduce<Record<string, FAQ[]>>((acc, faq) => {
    const category = String(faq.category ?? 'General').trim() || 'General';
    if (!acc[category]) acc[category] = [];
    acc[category].push(faq);
    return acc;
  }, {} as Record<string, FAQ[]>);

  const categories = Object.keys(faqsByCategory).sort();

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
          <p className="text-gray-600">
            Find answers to common questions about our car parts marketplace
          </p>
        </div>

        {faqs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <HelpCircle className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600 mb-4">No FAQs available yet.</p>
            <Link
              href="/request"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Request a part or ask a question →
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {categories.map((category) => (
              <section key={category}>
                <h2 className="text-xl font-semibold mb-4 text-primary-600">
                  {category}
                </h2>
                <div className="space-y-4">
                  {(Array.isArray(faqsByCategory[category]) ? faqsByCategory[category] : []).map((faq) => (
                    <div
                      key={faq.id}
                      className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
                    >
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        <div className="mt-12 p-6 bg-primary-50 rounded-lg text-center">
          <p className="text-gray-700 mb-2">Still have questions?</p>
          <Link
            href="/request"
            className="text-primary-600 hover:text-primary-700 font-semibold"
          >
            Request a part →
          </Link>
        </div>
      </div>
    </div>
  );
}
