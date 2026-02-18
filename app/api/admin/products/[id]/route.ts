import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabaseClient';
import { revalidateHome, revalidateProductsListing } from '@/lib/revalidate';

/**
 * Admin Products API Route (by ID)
 * PUT: Update product
 * DELETE: Delete product
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const updates = await request.json();
    const { image_urls, ...rest } = updates;
    const updatePayload: Record<string, unknown> = {
      ...rest,
      updated_at: new Date().toISOString(),
    };
    if (image_urls !== undefined) {
      updatePayload.image_urls = Array.isArray(image_urls) ? image_urls : null;
    }

    const { data: product, error } = await supabase
      .from('products')
      .update(updatePayload)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Invalidate cached pages that depend on products / featured products
    await Promise.all([revalidateHome(), revalidateProductsListing()]);

    return NextResponse.json({ product });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to update product', message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();

    const { error } = await supabase.from('products').delete().eq('id', params.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to delete product', message: error.message },
      { status: 500 }
    );
  }
}
