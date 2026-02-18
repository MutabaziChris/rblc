import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabaseClient';

/**
 * Admin Mechanics API Route
 * POST: Create new mechanic
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const mechanicData = await request.json();

    const { data: mechanic, error } = await supabase
      .from('mechanics')
      .insert(mechanicData)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ mechanic }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to create mechanic', message: error.message },
      { status: 500 }
    );
  }
}
