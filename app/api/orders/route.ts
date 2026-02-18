import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { notifyPartRequest } from '@/lib/notify';
import { getWhatsAppLink, formatPartRequestMessage } from '@/lib/whatsappLink';

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();

    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        customer_phone: orderData.customer_phone,
        customer_name: orderData.customer_name,
        requested_part: orderData.requested_part,
        car_brand: orderData.car_brand,
        car_model: orderData.car_model,
        status: 'pending',
        profit_margin: orderData.profit_margin || 0,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const partRequestData = {
      customer_name: orderData.customer_name,
      customer_phone: orderData.customer_phone,
      car_brand: orderData.car_brand,
      car_model: orderData.car_model,
      requested_part: orderData.requested_part,
      year: orderData.year,
      additional_info: orderData.additional_info,
    };

    // Send to business email
    await notifyPartRequest(partRequestData);

    // WhatsApp link for user to send to business (wa.me - no Twilio needed)
    const whatsappLink = getWhatsAppLink(formatPartRequestMessage(partRequestData));

    return NextResponse.json({ order, whatsappLink }, { status: 201 });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order', message: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const phone = searchParams.get('phone');

    let query = supabase.from('orders').select('*').order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }
    if (phone) {
      query = query.eq('customer_phone', phone);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ orders: data });
  } catch (error: any) {
    console.error('Orders fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders', message: error.message },
      { status: 500 }
    );
  }
}
