import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedAdmin } from '@/lib/admin-auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// App Router — set max body size for file uploads
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

// Max 5 MB
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
};

export async function POST(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    if (!ALLOWED_TYPES[file.type]) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPG, PNG, WebP, GIF, AVIF.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File is too large. Maximum size is 5 MB.' },
        { status: 400 }
      );
    }

    // Save to /public/uploads/products/
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'products');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const ext = ALLOWED_TYPES[file.type];
    const uniqueName = `product-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const filePath = join(uploadDir, uniqueName);

    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    // Return the public URL path
    const publicUrl = `/uploads/products/${uniqueName}`;

    return NextResponse.json({ success: true, url: publicUrl, name: uniqueName });
  } catch (err: any) {
    console.error('Image upload error:', err);
    return NextResponse.json({ error: 'Upload failed: ' + err.message }, { status: 500 });
  }
}

