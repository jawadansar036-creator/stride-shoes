import { NextRequest, NextResponse } from 'next/server';
import { 
  getStoreProducts, 
  createStoreProduct, 
  updateStoreProduct, 
  deleteStoreProduct 
} from '@/lib/store-data';
import { reindexVectorStore } from '@/lib/ai/vector-store';
import { isAuthorizedAdmin } from '@/lib/admin-auth';

export async function GET() {
  const products = getStoreProducts();
  return NextResponse.json({ success: true, products, total: products.length });
}

export async function POST(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.name || !body.price) {
      return NextResponse.json({ error: 'Product name and price are required.' }, { status: 400 });
    }

    const created = createStoreProduct({
      name: body.name,
      brand: body.brand || 'Stride',
      category: body.category || 'Running',
      gender: body.gender || 'Unisex',
      price: parseFloat(body.price),
      originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : undefined,
      discount: body.discount ? parseInt(body.discount, 10) : undefined,
      description: body.description || '',
      features: Array.isArray(body.features) ? body.features : (body.features ? body.features.split('\n').filter(Boolean) : []),
      images: Array.isArray(body.images) && body.images.length > 0 ? body.images : [
        body.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop'
      ],
      colors: Array.isArray(body.colors) ? body.colors : (body.colors ? body.colors.split(',').map((c: string) => c.trim()) : ['Standard Black / White']),
      sizes: Array.isArray(body.sizes) ? body.sizes : ['7', '8', '9', '10', '11', '12'],
      rating: body.rating ? parseFloat(body.rating) : 4.8,
      reviewCount: body.reviewCount ? parseInt(body.reviewCount, 10) : 12,
      inStock: body.inStock !== undefined ? Boolean(body.inStock) : true,
      isFeatured: Boolean(body.isFeatured),
      isNewArrival: Boolean(body.isNewArrival),
      isBestSeller: Boolean(body.isBestSeller),
    });

    // Re-index vectors asynchronously in background
    reindexVectorStore().catch((err) => console.error('Re-indexing error:', err));

    return NextResponse.json({ success: true, product: created });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required for update.' }, { status: 400 });
    }

    // Process numeric types if provided
    if (updates.price !== undefined) updates.price = parseFloat(updates.price);
    if (updates.originalPrice !== undefined) updates.originalPrice = updates.originalPrice ? parseFloat(updates.originalPrice) : undefined;
    if (updates.discount !== undefined) updates.discount = updates.discount ? parseInt(updates.discount, 10) : undefined;
    if (typeof updates.features === 'string') updates.features = updates.features.split('\n').filter(Boolean);
    if (typeof updates.colors === 'string') updates.colors = updates.colors.split(',').map((c: string) => c.trim());
    if (typeof updates.sizes === 'string') updates.sizes = updates.sizes.split(',').map((s: string) => s.trim());
    if (updates.image) updates.images = [updates.image];

    const updated = updateStoreProduct(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    // Refresh RAG vector cache
    reindexVectorStore().catch((err) => console.error('Re-indexing error:', err));

    return NextResponse.json({ success: true, product: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required.' }, { status: 400 });
    }

    const deleted = deleteStoreProduct(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    reindexVectorStore().catch((err) => console.error('Re-indexing error:', err));

    return NextResponse.json({ success: true, message: `Product ${id} deleted.` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
