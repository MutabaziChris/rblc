import { NextRequest, NextResponse } from 'next/server';
import { getAIResponse } from '@/lib/openai';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    // This endpoint handles incoming WhatsApp messages via Twilio webhook
    const formData = await request.formData();
    const from = formData.get('From') as string;
    const body = formData.get('Body') as string;

    if (!from || !body) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Extract phone number (remove whatsapp: prefix)
    const phoneNumber = from.replace('whatsapp:', '');

    // Get conversation history
    const { data: conversation } = await supabase
      .from('ai_conversations')
      .select('messages')
      .eq('customer_phone', phoneNumber)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const conversationHistory = conversation?.messages || [];

    // Get FAQs for context
    const { data: faqs } = await supabase.from('faqs').select('*');

    // Get AI response
    const { response, escalated } = await getAIResponse(
      body,
      conversationHistory,
      faqs || []
    );

    // Save conversation
    const conversationData = {
      customer_phone: phoneNumber,
      messages: [
        ...conversationHistory,
        { role: 'user' as const, content: body, timestamp: new Date().toISOString() },
        { role: 'assistant' as const, content: response, timestamp: new Date().toISOString() },
      ],
      escalated,
    };

    if (conversation) {
      await supabase
        .from('ai_conversations')
        .update(conversationData)
        .eq('customer_phone', phoneNumber);
    } else {
      await supabase.from('ai_conversations').insert(conversationData);
    }

    // WhatsApp reply disabled (using wa.me links instead of Twilio)
    // Response is saved in ai_conversations for reference

    // If escalated, notify admin (you can implement admin notification here)
    if (escalated) {
      console.log(`Escalated conversation from ${phoneNumber}`);
      // TODO: Send notification to admin dashboard or email
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('WhatsApp webhook error:', error);
    return NextResponse.json(
      { error: 'Failed to process WhatsApp message', message: error.message },
      { status: 500 }
    );
  }
}
