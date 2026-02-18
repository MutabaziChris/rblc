import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabaseClient';
import { revalidateHome, revalidateProductsListing } from '@/lib/revalidate';

/**
 * Admin Products API Route
 * POST: Create new product
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const productData = await request.json();

    const insertPayload: Record<string, unknown> = {
      name: productData.name,
      category: productData.category,
      price: productData.price,
      car_brand: productData.car_brand,
      car_model: productData.car_model,
      stock_status: productData.stock_status,
      supplier_id: productData.supplier_id,
      description: productData.description,
      image_url: productData.image_url ?? null,
      featured: productData.featured ?? false,
    };
    if (Array.isArray(productData.image_urls) && productData.image_urls.length > 0) {
      insertPayload.image_urls = productData.image_urls;
    }
    const { data: product, error } = await supabase
      .from('products')
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Invalidate cached pages that depend on products / featured products
    await Promise.all([revalidateHome(), revalidateProductsListing()]);

    return NextResponse.json({ product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to create product', message: error.message },
      { status: 500 }
    );
  }
}
