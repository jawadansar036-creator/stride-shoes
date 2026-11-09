import { NextRequest, NextResponse } from 'next/server';
import { 
  getStoreKnowledgeDocs, 
  createStoreKnowledgeDoc, 
  updateStoreKnowledgeDoc, 
  deleteStoreKnowledgeDoc 
} from '@/lib/store-data';
import { reindexVectorStore } from '@/lib/ai/vector-store';

export async function GET() {
  const docs = getStoreKnowledgeDocs();
  return NextResponse.json({ success: true, docs, total: docs.length });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title || !body.content) {
      return NextResponse.json({ error: 'Title and content are required.' }, { status: 400 });
    }

    const created = createStoreKnowledgeDoc({
      title: body.title,
      category: body.category || 'faq',
      content: body.content,
      keywords: Array.isArray(body.keywords) ? body.keywords : (body.keywords ? body.keywords.split(',').map((k: string) => k.trim()) : []),
    });

    reindexVectorStore().catch((err) => console.error('Re-indexing error:', err));
    return NextResponse.json({ success: true, doc: created });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Document ID is required.' }, { status: 400 });
    }

    if (typeof updates.keywords === 'string') {
      updates.keywords = updates.keywords.split(',').map((k: string) => k.trim());
    }

    const updated = updateStoreKnowledgeDoc(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Document not found.' }, { status: 404 });
    }

    reindexVectorStore().catch((err) => console.error('Re-indexing error:', err));
    return NextResponse.json({ success: true, doc: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Document ID is required.' }, { status: 400 });
    }

    const deleted = deleteStoreKnowledgeDoc(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Document not found.' }, { status: 404 });
    }

    reindexVectorStore().catch((err) => console.error('Re-indexing error:', err));
    return NextResponse.json({ success: true, message: `Document ${id} deleted.` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
