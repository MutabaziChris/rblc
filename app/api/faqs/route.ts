import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

/**
 * FAQs API Route
 * GET: Fetch all FAQs
 */
export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('category', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ faqs: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch FAQs', message: error.message },
      { status: 500 }
    );
  }
}
