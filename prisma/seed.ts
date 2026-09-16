import { PRODUCTS } from '../src/lib/products-data';
import { KNOWLEDGE_BASE } from '../src/lib/knowledge-base';
import { generateEmbedding } from '../src/lib/ai/embeddings';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting SoleCraft Database Seeder ---');

  if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.includes('postgresql')) {
    console.log('No PostgreSQL DATABASE_URL detected. The app uses the resilient built-in vector store automatically.');
    return;
  }

  try {
    console.log('Enabling pgvector extension...');
    await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS vector;`);

    console.log(`Seeding ${PRODUCTS.length} products with vector embeddings...`);
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
    }
    console.log(`Successfully seeded ${PRODUCTS.length} products!`);

    console.log(`Seeding ${KNOWLEDGE_BASE.length} knowledge base documents with vector embeddings...`);
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
    }
    console.log(`Successfully seeded ${KNOWLEDGE_BASE.length} knowledge base documents!`);
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
