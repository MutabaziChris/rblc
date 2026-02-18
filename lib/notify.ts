/**
 * Notify business via Email
 * WhatsApp uses wa.me links - no Twilio needed
 */

import { Resend } from 'resend';

const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL || 'info@rblc.rw';
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * Send notification email to business
 */
export async function notifyBusinessEmail(
  subject: string,
  bodyHtml: string,
  replyTo?: string
): Promise<boolean> {
  if (!resend) {
    console.warn('Resend not configured. Set RESEND_API_KEY in .env.local');
    return false;
  }

  try {
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'RBLC ltd <onboarding@resend.dev>',
      to: [BUSINESS_EMAIL],
      replyTo: replyTo || undefined,
      subject,
      html: bodyHtml,
    });

    if (error) {
      console.error('Email send error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Email send failed:', err);
    return false;
  }
}

/**
 * Notify business of part request (Email - WhatsApp via wa.me link)
 */
export async function notifyPartRequest(data: {
  customer_name: string;
  customer_phone: string;
  car_brand: string;
  car_model: string;
  requested_part: string;
  year?: string;
  additional_info?: string;
}): Promise<{ email: boolean }> {
  const htmlBody = `
    <h2>New Part Request</h2>
    <p><strong>Customer:</strong> ${data.customer_name}</p>
    <p><strong>Phone:</strong> ${data.customer_phone}</p>
    <p><strong>Car:</strong> ${data.car_brand} ${data.car_model}${data.year ? ` (${data.year})` : ''}</p>
    <p><strong>Part needed:</strong> ${data.requested_part}</p>
    ${data.additional_info ? `<p><strong>Additional info:</strong><br>${data.additional_info.replace(/\n/g, '<br>')}</p>` : ''}
    <hr/>
    <p><em>Contact the customer via WhatsApp to proceed.</em></p>
  `;

  const email = await notifyBusinessEmail(
    `Part Request: ${data.requested_part} - ${data.customer_name}`,
    htmlBody
  );

  return { email };
}

/**
 * Notify business of mechanic registration (Email - WhatsApp via wa.me link)
 */
export async function notifyMechanicRegistration(data: {
  name: string;
  garage_name: string;
  location: string;
  phone: string;
  email?: string;
  referral_code: string;
}): Promise<{ email: boolean }> {
  const htmlBody = `
    <h2>New Mechanic Registration</h2>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Garage:</strong> ${data.garage_name}</p>
    <p><strong>Location:</strong> ${data.location}</p>
    <p><strong>Phone:</strong> ${data.phone}</p>
    ${data.email ? `<p><strong>Email:</strong> ${data.email}</p>` : ''}
    <p><strong>Referral Code:</strong> ${data.referral_code}</p>
  `;

  const email = await notifyBusinessEmail(
    `Mechanic Registration: ${data.name} - ${data.garage_name}`,
    htmlBody
  );

  return { email };
}
