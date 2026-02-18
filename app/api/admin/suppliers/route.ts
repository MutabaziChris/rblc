import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabaseClient';

/**
 * Admin Suppliers API Route
 * POST: Create new supplier
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const supplierData = await request.json();

    const { data: supplier, error } = await supabase
      .from('suppliers')
      .insert(supplierData)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ supplier }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to create supplier', message: error.message },
      { status: 500 }
    );
  }
}
