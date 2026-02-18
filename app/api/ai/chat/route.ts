import { NextRequest, NextResponse } from 'next/server';
import { getAIResponse } from '@/lib/openai';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory, customerPhone } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Get FAQs for context
    const { data: faqs } = await supabase.from('faqs').select('*');

    // Get AI response
    const { response, escalated } = await getAIResponse(
      message,
      conversationHistory || [],
      faqs || []
    );

    // Save conversation if customer phone is provided
    if (customerPhone) {
      const conversationData = {
        customer_phone: customerPhone,
        messages: [
          ...(conversationHistory || []),
          { role: 'user' as const, content: message, timestamp: new Date().toISOString() },
          { role: 'assistant' as const, content: response, timestamp: new Date().toISOString() },
        ],
        escalated,
      };

      // Check if conversation exists
      const { data: existing } = await supabase
        .from('ai_conversations')
        .select('id')
        .eq('customer_phone', customerPhone)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (existing) {
        await supabase
          .from('ai_conversations')
          .update(conversationData)
          .eq('id', existing.id);
      } else {
        await supabase.from('ai_conversations').insert(conversationData);
      }
    }

    return NextResponse.json({ response, escalated });
  } catch (error: any) {
    console.error('AI chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request', message: error.message },
      { status: 500 }
    );
  }
}
