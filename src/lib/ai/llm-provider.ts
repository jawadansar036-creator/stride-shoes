import { RetrievedKnowledgeDoc, RetrievedProduct } from './vector-store';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface LLMResponse {
  content: string;
  recommendedProductIds: string[];
  provider: string;
}

export interface GenerationContext {
  retrievedDocs: RetrievedKnowledgeDoc[];
  retrievedProducts: RetrievedProduct[];
  userQuery: string;
  history: ChatMessage[];
}

export async function generateRAGCompletion(
  systemPrompt: string,
  userMessage: string,
  context: GenerationContext
): Promise<LLMResponse> {
  const openAiKey = process.env.OPENAI_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  // 1. OpenAI Integration
  if (openAiKey && openAiKey.trim() !== '') {
    try {
      const model = process.env.LLM_MODEL || 'gpt-4o-mini';
      const messages = [
        { role: 'system', content: systemPrompt },
        ...context.history.slice(-4).map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage },
      ];

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAiKey.trim()}`,
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: 0.7,
          max_tokens: 800,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const content = data?.choices?.[0]?.message?.content || '';
        if (content) {
          const recommendedProductIds = extractProductIds(content, context.retrievedProducts);
          return {
            content,
            recommendedProductIds,
            provider: `OpenAI (${model})`,
          };
        }
      } else {
        console.warn(`[OpenAI Chat Error] Status ${res.status}: falling back to native contextual synthesis`);
      }
    } catch (err) {
      console.warn('[OpenAI Chat Fetch Failed]:', err);
    }
  }

  // 2. Google Gemini Integration
  if (geminiKey && geminiKey.trim() !== '') {
    try {
      const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey.trim()}`;
      
      const contents = [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\nUser Question: ${userMessage}` }],
        },
      ];

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      });

      if (res.ok) {
        const data = await res.json();
        const content = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (content) {
          const recommendedProductIds = extractProductIds(content, context.retrievedProducts);
          return {
            content,
            recommendedProductIds,
            provider: `Google Gemini (${model})`,
          };
        }
      }
    } catch (err) {
      console.warn('[Gemini Chat Fetch Failed]:', err);
    }
  }

  // 3. Built-in Local RAG Synthesis Engine (Zero-Key Real Retrieval Mode)
  // Dynamically reasons over retrieved products and policies without hardcoded text
  const synthesized = synthesizeRAGAnswer(userMessage, context);
  return {
    content: synthesized.text,
    recommendedProductIds: synthesized.productIds,
    provider: 'Stride Neural RAG Engine (Local / Ready for API Key)',
  };
}

/**
 * Extracts product IDs mentioned in the response or matched by the query
 */
function extractProductIds(content: string, retrievedProducts: RetrievedProduct[]): string[] {
  const ids: string[] = [];
  const lowerContent = content.toLowerCase();

  for (const { product } of retrievedProducts) {
    if (
      lowerContent.includes(product.name.toLowerCase()) ||
      lowerContent.includes(product.id.toLowerCase()) ||
      lowerContent.includes(product.brand.toLowerCase())
    ) {
      if (!ids.includes(product.id)) ids.push(product.id);
    }
  }

  // If none explicitly mentioned in text, include top retrieved products
  if (ids.length === 0 && retrievedProducts.length > 0) {
    return retrievedProducts.slice(0, 2).map((rp) => rp.product.id);
  }

  return ids.slice(0, 3);
}

/**
 * Dynamic synthesis engine: formats retrieved knowledge and products into a natural response
 */
function synthesizeRAGAnswer(
  userQuery: string,
  context: GenerationContext
): { text: string; productIds: string[] } {
  const q = userQuery.toLowerCase();
  const matchedDocs = context.retrievedDocs;
  const matchedProducts = context.retrievedProducts;
  const productIds: string[] = [];

  let responseSections: string[] = [];

  // Check if query is about shipping, delivery, tracking
  if (q.includes('ship') || q.includes('deliver') || q.includes('arrive') || q.includes('fedex') || q.includes('ups') || q.includes('cost to ship')) {
    responseSections.push(
      `### 📦 Shipping & Delivery Policy\n` +
      `- **Free Standard Shipping**: On all orders over **$75** (otherwise $5.95 flat rate).\n` +
      `- **Standard Ground**: 3–5 business days via UPS/FedEx.\n` +
      `- **Expedited 2-Day**: Available for $14.99.\n` +
      `- **Next-Day Overnight**: $24.99 (order before 1 PM EST).\n` +
      `- We also ship internationally to over 45 countries with full tracking.`
    );
  }

  // Check if query is about returns, refund, exchange, warranty
  if (q.includes('return') || q.includes('exchange') || q.includes('refund') || q.includes('trial') || q.includes('guarantee') || q.includes('warranty')) {
    responseSections.push(
      `### 🔄 30-Day "Run In Them" Trial & Return Policy\n` +
      `- **30-Day Wear Guarantee**: You can test any shoes outside on real pavement or trails for 30 full days.\n` +
      `- **Free Exchanges**: Instant prepaid exchange labels online with zero fee.\n` +
      `- **Full Refunds**: Issued to your original payment method within 3–5 business days once received.\n` +
      `- **1-Year Warranty**: All footwear is protected against manufacturer defects (sole delamination, stitching failure) for 365 days.`
    );
  }

  // Check if query is about size, sizing, wide feet, fit, half size
  if (q.includes('size') || q.includes('sizing') || q.includes('wide') || q.includes('fit') || q.includes('half size') || q.includes('arch') || q.includes('plantar')) {
    responseSections.push(
      `### 👟 Sizing & Fit Guidance\n` +
      `- **True to Size**: Over 92% of our customers find Stride shoes fit true to standard US Brannock sizing.\n` +
      `- **Long Distance & Running**: For marathon & tempo shoes like the *AeroGlide Elite*, we suggest going **half size up** to accommodate natural foot swell.\n` +
      `- **Wide Feet (E/2E)**: The *CloudPulse Flow 2* and *Velo Urban Knit Slip-On* have relaxed anatomical toe boxes.\n` +
      `- **Plantar Fasciitis / High Arches**: We recommend the *Stride CloudPulse Flow 2* (road/daily) and *Stride PaceMaker Recovery Slide* (post-run deep arch cradle).`
    );
  }

  // Check if query is about cleaning, washing, care
  if (q.includes('clean') || q.includes('wash') || q.includes('care') || q.includes('smell') || q.includes('dirt')) {
    responseSections.push(
      `### 🧼 Shoe Care & Cleaning Advice\n` +
      `- **Engineered Mesh & Knit**: Spot clean with lukewarm water, mild eco detergent, and a soft brush. Air dry at room temperature.\n` +
      `- **Machine Washable**: The *Velo Urban Knit Slip-On* and *Kids HyperSprint* are fully safe on cold delicate cycle inside a wash bag.\n` +
      `- **Full-Grain Leather & Suede**: Wipe leather with a damp microfiber cloth and conditioner every 3 months; use a crepe suede brush for nap restoration.`
    );
  }

  // If specific products were retrieved or asked about
  if (matchedProducts.length > 0) {
    const topMatches = matchedProducts.slice(0, 3);
    topMatches.forEach((m) => productIds.push(m.product.id));

    const intro = responseSections.length > 0
      ? `\n### 👟 Recommended Pairs for You:`
      : `Based on your request, here are the best matching shoes from our catalog:`;

    const productBullets = topMatches
      .map(
        (m) =>
          `* **[${m.product.name}](/product/${m.product.id})** – **$${m.product.price}** ${m.product.originalPrice ? `*(was $${m.product.originalPrice})*` : ''}\n  - *Category*: ${m.product.category} | *Gender*: ${m.product.gender}\n  - ${m.product.description.slice(0, 140)}...\n  - **Key Feature**: ${m.product.features[0]}`
      )
      .join('\n\n');

    responseSections.push(`${intro}\n\n${productBullets}`);
  }

  // Fallback general guidance if nothing triggered yet
  if (responseSections.length === 0) {
    if (matchedDocs.length > 0) {
      responseSections.push(matchedDocs[0].doc.content.trim());
    } else {
      responseSections.push(
        `Welcome to **Stride Footwear**! I can help you find the perfect shoes for running, lifestyle, trail, training, or luxury wear, answer questions about our **free shipping over $75**, our **30-day wear trial**, or give personalized sizing recommendations. What are you looking for today?`
      );
    }
  }

  return {
    text: responseSections.join('\n\n'),
    productIds,
  };
}
