import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

/**
 * Mechanics API Route
 * GET: Fetch all mechanics
 */
export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('mechanics')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ mechanics: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch mechanics', message: error.message },
      { status: 500 }
    );
  }
}
