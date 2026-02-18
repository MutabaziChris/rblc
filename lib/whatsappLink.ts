/**
 * WhatsApp wa.me link helper
 * No Twilio needed - opens WhatsApp with pre-filled message for user to send
 */

const BUSINESS_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER ||
  process.env.WHATSAPP_BUSINESS_NUMBER ||
  '250786905080';

/**
 * Generate wa.me link that opens WhatsApp with pre-filled message
 * User taps the link, WhatsApp opens, they hit send
 */
export function getWhatsAppLink(message: string): string {
  const cleanNumber = BUSINESS_NUMBER.replace(/\D/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

/** Format part request for WhatsApp */
export function formatPartRequestMessage(data: {
  customer_name: string;
  customer_phone: string;
  car_brand: string;
  car_model: string;
  requested_part: string;
  year?: string;
  additional_info?: string;
}): string {
  return [
    '🔧 *Part Request*',
    `Customer: ${data.customer_name}`,
    `Phone: ${data.customer_phone}`,
    `Car: ${data.car_brand} ${data.car_model}${data.year ? ` (${data.year})` : ''}`,
    `Part: ${data.requested_part}`,
    data.additional_info ? `Notes: ${data.additional_info}` : null,
  ]
    .filter(Boolean)
    .join('\n');
}

/** Format mechanic registration for WhatsApp */
export function formatMechanicMessage(data: {
  name: string;
  garage_name: string;
  location: string;
  phone: string;
  email?: string;
  referral_code: string;
}): string {
  return [
    '🔧 *Mechanic Registration*',
    `Name: ${data.name}`,
    `Garage: ${data.garage_name}`,
    `Location: ${data.location}`,
    `Phone: ${data.phone}`,
    data.email ? `Email: ${data.email}` : null,
    `Referral Code: ${data.referral_code}`,
  ]
    .filter(Boolean)
    .join('\n');
}
