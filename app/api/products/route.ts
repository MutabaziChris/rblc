import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const model = searchParams.get('model');
    const search = searchParams.get('search');

    let query = supabase.from('products').select('*');

    if (category) {
      query = query.eq('category', category);
    }
    if (brand) {
      query = query.eq('car_brand', brand);
    }
    if (model) {
      query = query.eq('car_model', model);
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ products: data });
  } catch (error: any) {
    console.error('Products fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', message: error.message },
      { status: 500 }
    );
  }
}
