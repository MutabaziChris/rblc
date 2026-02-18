import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabaseClient';

/**
 * Admin FAQs API Route
 * POST: Create new FAQ
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const faqData = await request.json();

    const { data: faq, error } = await supabase
      .from('faqs')
      .insert(faqData)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ faq }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to create FAQ', message: error.message },
      { status: 500 }
    );
  }
}
