// Server-side cache revalidation helpers
'use server';

import { revalidatePath } from 'next/cache';

// Revalidate homepage (featured products, stats, etc.)
export async function revalidateHome() {
  revalidatePath('/');
}

// Revalidate products listing (and homepage, since featured products live there)
export async function revalidateProductsListing() {
  revalidatePath('/products');
  revalidatePath('/');
}

