import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabaseClient';

const BUCKET = 'products';
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

function isBucketNotFound(error: { message?: string }): boolean {
  const msg = (error.message || '').toLowerCase();
  return msg.includes('not found') || msg.includes('bucket') || msg.includes('does not exist');
}

/**
 * Admin Upload API
 * POST: Upload one or more product images to Supabase Storage
 * Returns array of public URLs
 * Creates the "products" bucket automatically if it doesn't exist.
 */
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Expected multipart/form-data with file(s)' },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const filesFromFiles = formData.getAll('files') as File[];
    const fileSingle = formData.get('file') as File | null;
    const allFiles = filesFromFiles.length
      ? filesFromFiles
      : fileSingle
        ? [fileSingle]
        : [];
    const toUpload = allFiles.filter((f): f is File => f instanceof File && f.size > 0);

    if (toUpload.length === 0) {
      return NextResponse.json(
        { error: 'No valid files to upload. Use "file" or "files" field.' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    const urls: string[] = [];

    for (const file of toUpload) {
      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          { error: `File ${file.name} exceeds 5MB limit` },
          { status: 400 }
        );
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `File ${file.name}: only JPEG, PNG, WebP, GIF allowed` },
          { status: 400 }
        );
      }

      const ext = file.name.split('.').pop() || 'jpg';
      const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const buffer = await file.arrayBuffer();

      let { data, error } = await supabase.storage
        .from(BUCKET)
        .upload(safeName, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (error && isBucketNotFound(error)) {
        const { error: createErr } = await supabase.storage.createBucket(BUCKET, {
          public: true,
        });
        if (createErr) {
          return NextResponse.json(
            {
              error: `Could not create bucket: ${createErr.message}. Create "products" bucket manually in Supabase Dashboard → Storage.`,
            },
            { status: 502 }
          );
        }
        const retry = await supabase.storage
          .from(BUCKET)
          .upload(safeName, buffer, { contentType: file.type, upsert: false });
        data = retry.data;
        error = retry.error;
      }

      if (error) {
        return NextResponse.json(
          { error: error.message || 'Upload failed' },
          { status: 500 }
        );
      }

      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(data!.path);
      urls.push(pub.publicUrl);
    }

    return NextResponse.json({ urls });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
