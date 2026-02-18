import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

/**
 * Suppliers API Route
 * GET: Fetch all suppliers
 */
export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('trust_score', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ suppliers: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch suppliers', message: error.message },
      { status: 500 }
    );
  }
}
