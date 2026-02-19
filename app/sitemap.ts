import type { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rblc.rw';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/mechanics`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/mechanics/register`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/suppliers`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/request`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/returns-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];

  let productPages: MetadataRoute.Sitemap = [];
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (url && key) {
      const supabase = createClient(url, key);
      const { data: products } = await supabase.from('products').select('id, updated_at');
      productPages = (products || []).map((p) => ({
        url: `${baseUrl}/products/${p.id}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }
  } catch {
    // Skip products if Supabase unavailable
  }

  return [...staticPages, ...productPages];
}
