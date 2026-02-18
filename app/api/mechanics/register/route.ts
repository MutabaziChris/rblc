import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { notifyMechanicRegistration } from '@/lib/notify';
import { getWhatsAppLink, formatMechanicMessage } from '@/lib/whatsappLink';

function generateReferralCode(name: string): string {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  const randomNum = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `${initials}${randomNum}`;
}

export async function POST(request: NextRequest) {
  try {
    const mechanicData = await request.json();

    // Generate unique referral code
    let referralCode = generateReferralCode(mechanicData.name);
    let attempts = 0;
    let isUnique = false;

    while (!isUnique && attempts < 10) {
      const { data: existing } = await supabase
        .from('mechanics')
        .select('id')
        .eq('referral_code', referralCode)
        .single();

      if (!existing) {
        isUnique = true;
      } else {
        referralCode = generateReferralCode(mechanicData.name + attempts);
        attempts++;
      }
    }

    const { data: mechanic, error } = await supabase
      .from('mechanics')
      .insert({
        name: mechanicData.name,
        garage_name: mechanicData.garage_name,
        location: mechanicData.location,
        phone: mechanicData.phone,
        email: mechanicData.email,
        referral_code: referralCode,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const regData = {
      name: mechanicData.name,
      garage_name: mechanicData.garage_name,
      location: mechanicData.location,
      phone: mechanicData.phone,
      email: mechanicData.email,
      referral_code: referralCode,
    };

    // Send to business email
    await notifyMechanicRegistration(regData);

    // WhatsApp link for user to notify business (wa.me - no Twilio needed)
    const whatsappLink = getWhatsAppLink(formatMechanicMessage(regData));

    return NextResponse.json({ mechanic, whatsappLink }, { status: 201 });
  } catch (error: any) {
    console.error('Mechanic registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register mechanic', message: error.message },
      { status: 500 }
    );
  }
}
