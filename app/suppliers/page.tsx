import { redirect } from 'next/navigation';

/**
 * Supplier page is hidden - redirect to FAQs
 */
export default function SuppliersPage() {
  redirect('/faq');
}
