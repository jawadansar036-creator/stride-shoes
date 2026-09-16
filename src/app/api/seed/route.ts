import { NextRequest, NextResponse } from 'next/server';
import { PRODUCTS } from '@/lib/products-data';
import { KNOWLEDGE_BASE } from '@/lib/knowledge-base';
import { ensureVectorIndices } from '@/lib/ai/vector-store';

export async function GET() {
  try {
    await ensureVectorIndices();
    const hasPostgres = Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.includes('postgresql'));
    const hasOpenAI = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim().length > 0);
    const hasGemini = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);

    return NextResponse.json({
      status: 'healthy',
      totalProducts: PRODUCTS.length,
      totalKnowledgeDocs: KNOWLEDGE_BASE.length,
      database: hasPostgres ? 'PostgreSQL + pgvector configured' : 'Resilient In-Memory Vector Store active',
      aiProvider: hasOpenAI ? 'OpenAI GPT-4o-mini' : hasGemini ? 'Google Gemini' : 'Stride Neural RAG Engine (Zero-Key Standalone)',
      ready: true,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const hasPostgres = Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.includes('postgresql'));
    if (!hasPostgres) {
      await ensureVectorIndices();
      return NextResponse.json({
        message: 'Resilient local vector store successfully initialized with 16 shoe products and 8 knowledge documents.',
        mode: 'embedded',
      });
    }

    const { prisma } = await import('@/lib/db');
    const { generateEmbedding } = await import('@/lib/ai/embeddings');

    // 1. Ensure pgvector extension
    await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS vector;`);

    // 2. Seed Products
    let productsSeeded = 0;
    for (const prod of PRODUCTS) {
      const textToEmbed = `${prod.name} ${prod.brand} ${prod.category} ${prod.gender} $${prod.price} ${prod.description} ${prod.features.join(' ')}`;
      const emb = await generateEmbedding(textToEmbed);
      const vecString = `[${emb.join(',')}]`;

      await prisma.$executeRawUnsafe(`
        INSERT INTO "Product" (
          id, name, slug, brand, category, gender, price, "originalPrice", discount,
          description, features, images, colors, sizes, rating, "reviewCount", "inStock",
          "isFeatured", "isNewArrival", "isBestSeller", embedding, "createdAt", "updatedAt"
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9,
          $10, $11, $12, $13, $14, $15, $16, $17,
          $18, $19, $20, $21::vector, NOW(), NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          price = EXCLUDED.price,
          description = EXCLUDED.description,
          embedding = EXCLUDED.embedding,
          "updatedAt" = NOW();
      `,
        prod.id, prod.name, prod.slug, prod.brand, prod.category, prod.gender,
        prod.price, prod.originalPrice || null, prod.discount || null,
        prod.description, prod.features, prod.images, prod.colors, prod.sizes,
        prod.rating, prod.reviewCount, prod.inStock,
        prod.isFeatured, prod.isNewArrival, prod.isBestSeller, vecString
      );
      productsSeeded++;
    }

    // 3. Seed Knowledge Base
    let docsSeeded = 0;
    for (const doc of KNOWLEDGE_BASE) {
      const textToEmbed = `${doc.title} ${doc.category} ${doc.keywords.join(' ')} ${doc.content}`;
      const emb = await generateEmbedding(textToEmbed);
      const vecString = `[${emb.join(',')}]`;

      await prisma.$executeRawUnsafe(`
        INSERT INTO "KnowledgeDocument" (id, title, category, content, embedding, "createdAt")
        VALUES ($1, $2, $3, $4, $5::vector, NOW())
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          content = EXCLUDED.content,
          embedding = EXCLUDED.embedding;
      `, doc.id, doc.title, doc.category, doc.content, vecString);
      docsSeeded++;
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${productsSeeded} products and ${docsSeeded} knowledge docs into PostgreSQL with pgvector!`,
    });
  } catch (err: any) {
    console.error('[Seed Error]:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
