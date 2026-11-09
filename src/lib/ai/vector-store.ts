import { ProductItem } from '../products-data';
import { KnowledgeDoc } from '../knowledge-base';
import { getStoreProducts, getStoreKnowledgeDocs } from '../store-data';
import { generateEmbedding, cosineSimilarity } from './embeddings';

export interface RetrievedProduct {
  product: ProductItem;
  similarity: number;
}

export interface RetrievedKnowledgeDoc {
  doc: KnowledgeDoc;
  similarity: number;
}

// In-memory vector cache for high-speed retrieval
interface VectorIndexItem<T> {
  item: T;
  text: string;
  embedding: number[];
}

let productIndexCache: VectorIndexItem<ProductItem>[] | null = null;
let knowledgeIndexCache: VectorIndexItem<KnowledgeDoc>[] | null = null;
let isIndexing = false;

/**
 * Re-indexes all vector embeddings (useful after admin adds/updates products or policies)
 */
export async function reindexVectorStore(): Promise<void> {
  productIndexCache = null;
  knowledgeIndexCache = null;
  await ensureVectorIndices();
}

/**
 * Initializes the vector cache on startup
 */
export async function ensureVectorIndices(): Promise<void> {
  if (productIndexCache && knowledgeIndexCache) return;
  if (isIndexing) {
    while (isIndexing) {
      await new Promise((r) => setTimeout(r, 100));
    }
    return;
  }

  isIndexing = true;
  try {
    const products = getStoreProducts();
    const knowledgeDocs = getStoreKnowledgeDocs();

    // 1. Index products
    const productItems: VectorIndexItem<ProductItem>[] = [];
    for (const prod of products) {
      const textToEmbed = `Product: ${prod.name}. Brand: ${prod.brand}. Category: ${prod.category}. Gender: ${prod.gender}. Price: $${prod.price}. Colors: ${prod.colors.join(', ')}. Sizes: ${prod.sizes.join(', ')}. Description: ${prod.description}. Features: ${prod.features.join(' ')}`;
      const embedding = await generateEmbedding(textToEmbed);
      productItems.push({
        item: prod,
        text: textToEmbed,
        embedding,
      });
    }
    productIndexCache = productItems;

    // 2. Index knowledge base
    const knowledgeItems: VectorIndexItem<KnowledgeDoc>[] = [];
    for (const doc of knowledgeDocs) {
      const textToEmbed = `Title: ${doc.title}. Category: ${doc.category}. Keywords: ${doc.keywords.join(', ')}. Content: ${doc.content}`;
      const embedding = await generateEmbedding(textToEmbed);
      knowledgeItems.push({
        item: doc,
        text: textToEmbed,
        embedding,
      });
    }
    knowledgeIndexCache = knowledgeItems;
    console.log(`[VectorStore] Indexed ${productIndexCache.length} products and ${knowledgeIndexCache.length} knowledge docs.`);
  } finally {
    isIndexing = false;
  }
}

/**
 * Vector similarity search against Knowledge Base documents
 */
export async function searchKnowledgeBase(
  query: string,
  topK = 3,
  minSimilarity = 0.15
): Promise<RetrievedKnowledgeDoc[]> {
  await ensureVectorIndices();
  if (!knowledgeIndexCache) return [];

  // 1. Check if PostgreSQL + pgvector is configured
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('postgresql')) {
    try {
      const { prisma } = await import('../db');
      const queryEmbedding = await generateEmbedding(query);
      const vectorString = `[${queryEmbedding.join(',')}]`;

      // pgvector cosine distance: embedding <=> $1::vector
      const results = await prisma.$queryRaw<Array<{ id: string; title: string; category: string; content: string; similarity: number }>>`
        SELECT id, title, category, content, 1 - (embedding <=> ${vectorString}::vector) as similarity
        FROM "KnowledgeDocument"
        WHERE embedding IS NOT NULL
        ORDER BY embedding <=> ${vectorString}::vector ASC
        LIMIT ${topK};
      `;

      if (results && results.length > 0) {
        return results.map((r) => ({
          doc: {
            id: r.id,
            title: r.title,
            category: r.category as any,
            content: r.content,
            keywords: [],
          },
          similarity: Number(r.similarity),
        }));
      }
    } catch (err) {
      // Gracefully fall through to in-memory vector store
      console.warn('[pgvector searchKnowledgeBase failed, using fallback engine]:', err);
    }
  }

  // Fallback: In-memory Cosine Vector Similarity
  const queryVec = await generateEmbedding(query);
  const scored = knowledgeIndexCache.map((item) => {
    const similarity = cosineSimilarity(queryVec, item.embedding);
    return {
      doc: item.item,
      similarity,
    };
  });

  return scored
    .filter((s) => s.similarity >= minSimilarity)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
}

/**
 * Vector similarity search against Products catalog
 */
export async function searchProductsVector(
  query: string,
  topK = 4,
  minSimilarity = 0.12
): Promise<RetrievedProduct[]> {
  await ensureVectorIndices();
  if (!productIndexCache) return [];

  // 1. Check if PostgreSQL + pgvector is configured
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('postgresql')) {
    try {
      const { prisma } = await import('../db');
      const queryEmbedding = await generateEmbedding(query);
      const vectorString = `[${queryEmbedding.join(',')}]`;

      const results = await prisma.$queryRaw<Array<{ id: string; similarity: number }>>`
        SELECT id, 1 - (embedding <=> ${vectorString}::vector) as similarity
        FROM "Product"
        WHERE embedding IS NOT NULL
        ORDER BY embedding <=> ${vectorString}::vector ASC
        LIMIT ${topK};
      `;

      if (results && results.length > 0) {
        const retrieved: RetrievedProduct[] = [];
        const allProds = getStoreProducts();
        for (const r of results) {
          const matched = allProds.find((p) => p.id === r.id);
          if (matched) {
            retrieved.push({ product: matched, similarity: Number(r.similarity) });
          }
        }
        if (retrieved.length > 0) return retrieved;
      }
    } catch (err) {
      console.warn('[pgvector searchProductsVector failed, using fallback engine]:', err);
    }
  }

  // Fallback: In-memory Cosine Vector Similarity
  const queryVec = await generateEmbedding(query);
  const scored = productIndexCache.map((item) => {
    const similarity = cosineSimilarity(queryVec, item.embedding);
    return {
      product: item.item,
      similarity,
    };
  });

  return scored
    .filter((s) => s.similarity >= minSimilarity)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
}
