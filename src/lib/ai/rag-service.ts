import { searchKnowledgeBase, searchProductsVector, RetrievedKnowledgeDoc, RetrievedProduct } from './vector-store';
import { generateRAGCompletion, ChatMessage, LLMResponse } from './llm-provider';
import { PRODUCTS, ProductItem } from '../products-data';

export interface RAGAnswer {
  message: string;
  recommendedProducts: ProductItem[];
  citations: string[];
  suggestedQuestions: string[];
  provider: string;
}

export async function askRAGShoppingAssistant(
  userQuery: string,
  history: ChatMessage[] = []
): Promise<RAGAnswer> {
  const cleanQuery = userQuery.trim();

  // 1. Parallel Vector Retrieval for Knowledge Base & Products
  const [retrievedDocs, retrievedProducts] = await Promise.all([
    searchKnowledgeBase(cleanQuery, 3, 0.1),
    searchProductsVector(cleanQuery, 4, 0.1),
  ]);

  // Also extract heuristic filters (e.g. price constraint: under $100, color: red, category: running)
  const additionalProducts = findProductsByCriteria(cleanQuery);
  const combinedProductsMap = new Map<string, RetrievedProduct>();

  for (const rp of retrievedProducts) {
    combinedProductsMap.set(rp.product.id, rp);
  }
  for (const p of additionalProducts) {
    if (!combinedProductsMap.has(p.id)) {
      combinedProductsMap.set(p.id, { product: p, similarity: 0.85 });
    }
  }

  const finalRetrievedProducts = Array.from(combinedProductsMap.values()).slice(0, 5);

  // 2. Build Grounding Context
  const knowledgeContext = retrievedDocs.length > 0
    ? retrievedDocs.map((rd) => `### Document: ${rd.doc.title}\n${rd.doc.content}`).join('\n\n')
    : 'Standard 30-day wear test trial. Free standard shipping over $75.';

  const productContext = finalRetrievedProducts.length > 0
    ? finalRetrievedProducts
        .map(
          (rp) =>
            `- Product: ${rp.product.name} (ID: ${rp.product.id}) | Brand: ${rp.product.brand} | Category: ${rp.product.category} | Gender: ${rp.product.gender} | Price: $${rp.product.price} (Original: $${rp.product.originalPrice || rp.product.price}) | In Stock: ${rp.product.inStock}\n  Colors: ${rp.product.colors.join(', ')} | Sizes: ${rp.product.sizes.join(', ')}\n  Description: ${rp.product.description}\n  Key Features: ${rp.product.features.join('; ')}`
        )
        .join('\n\n')
    : 'No directly matching shoe models found in vector query.';

  // 3. Construct System Prompt
  const systemPrompt = `
You are the elite AI Shopping Specialist & Footwear Concierge for "Stride Footwear", a modern premium shoe brand.
You help customers find the perfect shoes, choose the right sizes, understand technologies (supercritical nitrogen foam, carbon plates, GORE-TEX, Vibram), and clarify store policies (free shipping over $75, 30-day wear test trial, free exchanges).

Tone: Friendly, authoritative, knowledgeable, concise, and helpful.

RULES:
1. Always ground your answers in the provided KNOWLEDGE BASE and PRODUCT CATALOG.
2. When recommending shoes, mention the exact product name, price, key features, and why it matches their use case.
3. If the user asks about shipping or returns, cite our actual policies (Free shipping on orders over $75, 30-day outdoor wear trial, free prepaid exchanges).
4. If the user asks about sizing or foot conditions (e.g., wide feet, plantar fasciitis, marathon training), provide specific tailored advice.
5. Format your output cleanly using markdown bullet points and bolding. Keep answers engaging and not overly verbose.

====================
RETRIEVED KNOWLEDGE BASE:
${knowledgeContext}

====================
RETRIEVED PRODUCT CATALOG:
${productContext}
====================
`.trim();

  // 4. Generate Completion via LLM
  const llmResult: LLMResponse = await generateRAGCompletion(systemPrompt, cleanQuery, {
    retrievedDocs,
    retrievedProducts: finalRetrievedProducts,
    userQuery: cleanQuery,
    history,
  });

  // 5. Hydrate Recommended Products
  const recommendedProducts: ProductItem[] = [];
  for (const pid of llmResult.recommendedProductIds) {
    const prod = PRODUCTS.find((p) => p.id === pid);
    if (prod && !recommendedProducts.some((r) => r.id === prod.id)) {
      recommendedProducts.push(prod);
    }
  }

  // Fallback: if user asked for products and none hydrated yet, include top retrieved products
  if (
    recommendedProducts.length === 0 &&
    finalRetrievedProducts.length > 0 &&
    (cleanQuery.toLowerCase().includes('shoe') ||
     cleanQuery.toLowerCase().includes('pair') ||
     cleanQuery.toLowerCase().includes('recommend') ||
     cleanQuery.toLowerCase().includes('under') ||
     cleanQuery.toLowerCase().includes('best') ||
     cleanQuery.toLowerCase().includes('run'))
  ) {
    recommendedProducts.push(...finalRetrievedProducts.slice(0, 2).map((rp) => rp.product));
  }

  // 6. Citations
  const citations = retrievedDocs.map((d) => d.doc.title);

  // 7. Dynamic Suggested Next Questions
  const suggestedQuestions = generateSuggestedFollowUps(cleanQuery);

  return {
    message: llmResult.content,
    recommendedProducts,
    citations,
    suggestedQuestions,
    provider: llmResult.provider,
  };
}

/**
 * Filter helper for budget, color, category, gender queries
 */
function findProductsByCriteria(query: string): ProductItem[] {
  const q = query.toLowerCase();
  let results = [...PRODUCTS];

  // Budget matching e.g. "under 100", "under $150", "budget"
  const underPriceMatch = q.match(/under\s*\$?(\d+)/i) || q.match(/less\s*than\s*\$?(\d+)/i);
  if (underPriceMatch) {
    const maxPrice = parseFloat(underPriceMatch[1]);
    results = results.filter((p) => p.price <= maxPrice);
  }

  // Category matching
  if (q.includes('running') || q.includes('runner') || q.includes('marathon')) {
    results = results.filter((p) => p.category === 'Running');
  } else if (q.includes('trail') || q.includes('hiking') || q.includes('outdoor')) {
    results = results.filter((p) => p.category === 'Trail');
  } else if (q.includes('basketball') || q.includes('court') || q.includes('hoop')) {
    results = results.filter((p) => p.category === 'Basketball');
  } else if (q.includes('lifestyle') || q.includes('casual') || q.includes('sneaker') || q.includes('daily')) {
    results = results.filter((p) => p.category === 'Lifestyle');
  } else if (q.includes('training') || q.includes('gym') || q.includes('workout') || q.includes('hiit')) {
    results = results.filter((p) => p.category === 'Training');
  } else if (q.includes('luxury') || q.includes('suede') || q.includes('chelsea') || q.includes('high end')) {
    results = results.filter((p) => p.category === 'Luxury');
  }

  // Gender matching
  if (q.includes('women') || q.includes('woman') || q.includes('female')) {
    results = results.filter((p) => p.gender === 'Women' || p.gender === 'Unisex');
  } else if (q.includes('men') || q.includes('man') || q.includes('male')) {
    results = results.filter((p) => p.gender === 'Men' || p.gender === 'Unisex');
  } else if (q.includes('kids') || q.includes('boy') || q.includes('girl') || q.includes('children')) {
    results = results.filter((p) => p.gender === 'Kids');
  }

  return results.slice(0, 3);
}

function generateSuggestedFollowUps(query: string): string[] {
  const q = query.toLowerCase();
  if (q.includes('ship') || q.includes('deliver')) {
    return [
      'What is your return policy?',
      'Do you offer free exchanges?',
      'How do I track my order?'
    ];
  }
  if (q.includes('size') || q.includes('fit')) {
    return [
      'Which shoes are best for wide feet?',
      'What if the size does not fit?',
      'Show me best-selling running shoes'
    ];
  }
  if (q.includes('run') || q.includes('marathon')) {
    return [
      'Are the AeroGlide Elite true to size?',
      'What is your 30-day wear trial?',
      'Do you have running shoes under $150?'
    ];
  }
  return [
    'What is your shipping policy?',
    'Which shoes are best for standing all day?',
    'Show me shoes under $150',
    'Do you have shoes for wide feet?'
  ];
}
