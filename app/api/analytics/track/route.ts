import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabaseClient';

/**
 * Visitor Analytics - Track API
 * POST: Record a page visit. Called by trackVisitor() from the client.
 * Uses service role to insert into visits table.
 * IP is captured from request headers (set by Vercel/reverse proxy).
 */
export async function POST(request: NextRequest) {
  try {
    // Handle both JSON and Blob (sendBeacon) bodies
    let body: Record<string, unknown>;
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      body = await request.json();
    } else {
      const text = await request.text();
      body = text ? JSON.parse(text) : {};
    }
    const pageUrl = typeof body?.page_url === 'string' ? body.page_url.trim() : '';
    const userAgent = typeof body?.user_agent === 'string' ? body.user_agent : null;

    if (!pageUrl) {
      return NextResponse.json({ error: 'page_url required' }, { status: 400 });
    }

    // Get client IP (Vercel: x-forwarded-for or x-real-ip)
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ipAddress = forwarded?.split(',')[0]?.trim() || realIp || null;

    const supabase = createServerClient();
    const { error } = await supabase.from('visits').insert({
      page_url: pageUrl,
      user_agent: userAgent || null,
      ip_address: ipAddress,
      visited_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Analytics track error:', error);
      return NextResponse.json({ error: 'Failed to record visit' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Analytics track error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
