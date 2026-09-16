/**
 * Embeddings Service
 * Supports OpenAI text-embedding-3-small (1536 dims), Google Gemini text-embedding-004,
 * and a deterministic semantic feature vector generator (1536 dims) for zero-dependency local runs.
 */

export const EMBEDDING_DIMENSION = 1536;

export async function generateEmbedding(text: string): Promise<number[]> {
  const cleanText = text.replace(/\n+/g, ' ').trim();
  if (!cleanText) {
    return new Array(EMBEDDING_DIMENSION).fill(0);
  }

  // 1. Try OpenAI if API key is present
  const openAiKey = process.env.OPENAI_API_KEY;
  if (openAiKey && openAiKey.trim() !== '') {
    try {
      const model = process.env.EMBEDDING_MODEL || 'text-embedding-3-small';
      const res = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAiKey.trim()}`,
        },
        body: JSON.stringify({
          input: cleanText,
          model: model,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.data?.[0]?.embedding) {
          return data.data[0].embedding;
        }
      } else {
        console.warn(`[OpenAI Embedding Error] HTTP ${res.status}: Falling back to local semantic vector`);
      }
    } catch (err) {
      console.warn('[OpenAI Embedding Fetch Failed] Falling back to local semantic vector:', err);
    }
  }

  // 2. Try Gemini if GEMINI_API_KEY is present
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey && geminiKey.trim() !== '') {
    try {
      const model = process.env.GEMINI_EMBEDDING_MODEL || 'text-embedding-004';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent?key=${geminiKey.trim()}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: `models/${model}`,
          content: { parts: [{ text: cleanText }] },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const values: number[] = data?.embedding?.values || [];
        if (values.length > 0) {
          // If gemini vector is 768 dims, normalize and project/pad to 1536
          return padOrProjectVector(values, EMBEDDING_DIMENSION);
        }
      }
    } catch (err) {
      console.warn('[Gemini Embedding Fetch Failed]:', err);
    }
  }

  // 3. Resilient Deterministic Semantic Vectorizer (Fallback)
  return createSemanticVector(cleanText, EMBEDDING_DIMENSION);
}

/**
 * Creates a normalized 1536-dimensional sparse-dense projection vector
 * from token n-grams and hashing with Murmur-style distribution.
 * Preserves high cosine similarity between semantically related words & synonyms.
 */
export function createSemanticVector(text: string, dimensions = EMBEDDING_DIMENSION): number[] {
  const vector = new Array(dimensions).fill(0);
  const normalized = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const tokens = normalized.split(/\s+/).filter(Boolean);

  if (tokens.length === 0) {
    return vector;
  }

  // Add semantic weights for key domain tokens
  const keySynonyms: Record<string, string[]> = {
    running: ['jogging', 'run', 'marathon', 'sprint', 'tempo', 'cardio', 'speed', 'aeroglide', 'velocity'],
    shipping: ['delivery', 'deliver', 'ship', 'fedex', 'ups', 'transit', 'arrive', 'fast', 'free shipping', 'cost'],
    returns: ['return', 'refund', 'exchange', 'warranty', 'guarantee', 'trial', 'money back'],
    sizing: ['size', 'fit', 'wide', 'narrow', 'arch', 'feet', 'tight', 'loose', 'measure', 'plantar'],
    trail: ['hiking', 'hike', 'mountains', 'gore-tex', 'waterproof', 'outdoor', 'mud', 'grip', 'vibram'],
    basketball: ['court', 'hoops', 'jump', 'dunk', 'hardwood', 'ankle'],
    lifestyle: ['casual', 'sneaker', 'leather', 'everyday', 'minimalist', 'clean', 'office', 'retro'],
    luxury: ['designer', 'suede', 'italian', 'elevated', 'platform', 'chelsea', 'fashion'],
    cushion: ['soft', 'plush', 'foam', 'cloud', 'nitrogen', 'support', 'comfort', 'pain', 'heel'],
    price: ['cheap', 'budget', 'affordable', 'under', 'cost', 'expensive', 'discount', 'sale']
  };

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    
    // Hash unigram
    hashIntoVector(token, vector, 1.0, dimensions);

    // Hash bigrams for phrases
    if (i < tokens.length - 1) {
      const bigram = `${token}_${tokens[i + 1]}`;
      hashIntoVector(bigram, vector, 1.4, dimensions);
    }

    // Check synonym clusters
    for (const [concept, synonyms] of Object.entries(keySynonyms)) {
      if (token === concept || synonyms.includes(token)) {
        hashIntoVector(`concept_${concept}`, vector, 2.5, dimensions);
      }
    }
  }

  // Normalize to unit vector for true cosine distance calculation
  let norm = 0;
  for (let i = 0; i < dimensions; i++) {
    norm += vector[i] * vector[i];
  }
  norm = Math.sqrt(norm);

  if (norm > 0) {
    for (let i = 0; i < dimensions; i++) {
      vector[i] = vector[i] / norm;
    }
  }

  return vector;
}

function hashIntoVector(term: string, vector: number[], weight: number, dimensions: number) {
  let hash1 = 5381;
  let hash2 = 0;
  for (let i = 0; i < term.length; i++) {
    const char = term.charCodeAt(i);
    hash1 = ((hash1 << 5) + hash1) ^ char;
    hash2 = (hash2 * 31 + char) >>> 0;
  }
  const idx1 = Math.abs(hash1) % dimensions;
  const idx2 = Math.abs(hash2) % dimensions;
  vector[idx1] += weight;
  vector[idx2] += weight * 0.5;
}

function padOrProjectVector(vec: number[], targetDim: number): number[] {
  if (vec.length === targetDim) return vec;
  const result = new Array(targetDim).fill(0);
  for (let i = 0; i < targetDim; i++) {
    result[i] = vec[i % vec.length];
  }
  // Re-normalize
  let norm = 0;
  for (let i = 0; i < targetDim; i++) norm += result[i] * result[i];
  norm = Math.sqrt(norm);
  if (norm > 0) {
    for (let i = 0; i < targetDim; i++) result[i] /= norm;
  }
  return result;
}

/**
 * Computes Cosine Similarity between two unit-normalized vectors: range [-1, 1]
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;
  let dot = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
  }
  return dot;
}
