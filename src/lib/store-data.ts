import fs from 'fs';
import path from 'path';
import { PRODUCTS as DEFAULT_PRODUCTS, ProductItem } from './products-data';
import { KNOWLEDGE_BASE as DEFAULT_KNOWLEDGE, KnowledgeDoc } from './knowledge-base';

export interface StoreSettings {
  announcementText: string;
  freeShippingThreshold: number;
  promoCode: string;
  promoDiscount: number;
  heroTitle: string;
  heroSubtitle: string;
}

export interface StoreOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  city: string;
  itemsCount: number;
  itemsSummary: string;
  total: number;
  status: 'Confirmed' | 'Shipped' | 'Delivered';
  createdAt: string;
}

const DEFAULT_SETTINGS: StoreSettings = {
  announcementText: 'Free Express Shipping on Orders Over $75 | 30-Day "Run In Them" Trial Guarantee',
  freeShippingThreshold: 75,
  promoCode: 'STRIDE10',
  promoDiscount: 10,
  heroTitle: 'Find Your Perfect Pair.',
  heroSubtitle: 'Premium footwear engineered for every step. Supercritical nitrogen foam & carbon propulsion.',
};

const DEFAULT_ORDERS: StoreOrder[] = [
  {
    id: 'ord-1',
    orderNumber: 'STR-842910',
    customerName: 'Marcus Vance',
    customerEmail: 'marcus.v@runner.io',
    shippingAddress: '100 Marathon Way, Apt 4B',
    city: 'Boston, MA',
    itemsCount: 2,
    itemsSummary: 'Stride AeroGlide Elite Carbon (Size 9.5), Stride PaceMaker Recovery Slide (Size 10)',
    total: 240.00,
    status: 'Confirmed',
    createdAt: '12 mins ago',
  },
  {
    id: 'ord-2',
    orderNumber: 'STR-719304',
    customerName: 'Elena Rostova',
    customerEmail: 'elena@strideclub.com',
    shippingAddress: '42 Pine Crest Rd',
    city: 'Seattle, WA',
    itemsCount: 1,
    itemsSummary: 'Stride CloudPulse Flow 2 (Size 8)',
    total: 140.00,
    status: 'Shipped',
    createdAt: '2 hours ago',
  },
  {
    id: 'ord-3',
    orderNumber: 'STR-604812',
    customerName: 'David Kim',
    customerEmail: 'dkim@athletic.org',
    shippingAddress: '780 Lakeview Ave',
    city: 'Chicago, IL',
    itemsCount: 1,
    itemsSummary: 'Apex ApexSummit Waterproof Trail (Size 10)',
    total: 175.00,
    status: 'Delivered',
    createdAt: 'Yesterday',
  },
  {
    id: 'ord-4',
    orderNumber: 'STR-592184',
    customerName: 'Sophia Taylor',
    customerEmail: 'sophia.t@luxe.co',
    shippingAddress: '310 Fifth Ave',
    city: 'New York, NY',
    itemsCount: 2,
    itemsSummary: 'Aura Monolith Chunky Sneaker (Size 7), Velo Retro 88 Minimalist (Size 7.5)',
    total: 375.00,
    status: 'Delivered',
    createdAt: '2 days ago',
  }
];

// In-memory memory cache
let cachedProducts: ProductItem[] | null = null;
let cachedKnowledge: KnowledgeDoc[] | null = null;
let cachedSettings: StoreSettings | null = null;
let cachedOrders: StoreOrder[] | null = null;

// File persistence paths (created inside project root /data)
function getDataDir(): string {
  const dir = path.join(process.cwd(), 'data');
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (e) {
    // Graceful fallback for read-only serverless runtimes
  }
  return dir;
}

function loadFromFile<T>(filename: string, fallback: T): T {
  try {
    const filePath = path.join(getDataDir(), filename);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    // Ignore error and return fallback
  }
  return fallback;
}

function saveToFile<T>(filename: string, data: T): void {
  try {
    const filePath = path.join(getDataDir(), filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    // If filesystem is read-only (e.g. Vercel serverless), in-memory cache preserves state during function lifecycle
  }
}

// ---------------- PRODUCTS ----------------

export function getStoreProducts(): ProductItem[] {
  if (!cachedProducts) {
    cachedProducts = loadFromFile<ProductItem[]>('products.json', [...DEFAULT_PRODUCTS]);
  }
  return cachedProducts;
}

export function getProductById(idOrSlug: string): ProductItem | undefined {
  const products = getStoreProducts();
  return products.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
}

export function createStoreProduct(productData: Omit<ProductItem, 'id' | 'slug'> & { slug?: string }): ProductItem {
  const products = getStoreProducts();
  const id = `prod-${Date.now().toString().slice(-6)}`;
  const slug = productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const newProduct: ProductItem = {
    ...productData,
    id,
    slug: `${slug}-${id.slice(-4)}`,
  };

  const updated = [newProduct, ...products];
  cachedProducts = updated;
  saveToFile('products.json', updated);
  return newProduct;
}

export function updateStoreProduct(id: string, updates: Partial<ProductItem>): ProductItem | null {
  const products = getStoreProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return null;

  const updatedItem = { ...products[idx], ...updates };
  products[idx] = updatedItem;
  cachedProducts = [...products];
  saveToFile('products.json', cachedProducts);
  return updatedItem;
}

export function deleteStoreProduct(id: string): boolean {
  const products = getStoreProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;

  cachedProducts = filtered;
  saveToFile('products.json', filtered);
  return true;
}

// ---------------- KNOWLEDGE BASE ----------------

export function getStoreKnowledgeDocs(): KnowledgeDoc[] {
  if (!cachedKnowledge) {
    cachedKnowledge = loadFromFile<KnowledgeDoc[]>('knowledge.json', [...DEFAULT_KNOWLEDGE]);
  }
  return cachedKnowledge;
}

export function createStoreKnowledgeDoc(docData: Omit<KnowledgeDoc, 'id'>): KnowledgeDoc {
  const docs = getStoreKnowledgeDocs();
  const id = `kb-custom-${Date.now().toString().slice(-6)}`;
  const newDoc: KnowledgeDoc = { ...docData, id };

  const updated = [...docs, newDoc];
  cachedKnowledge = updated;
  saveToFile('knowledge.json', updated);
  return newDoc;
}

export function updateStoreKnowledgeDoc(id: string, updates: Partial<KnowledgeDoc>): KnowledgeDoc | null {
  const docs = getStoreKnowledgeDocs();
  const idx = docs.findIndex((d) => d.id === id);
  if (idx === -1) return null;

  const updatedDoc = { ...docs[idx], ...updates };
  docs[idx] = updatedDoc;
  cachedKnowledge = [...docs];
  saveToFile('knowledge.json', cachedKnowledge);
  return updatedDoc;
}

export function deleteStoreKnowledgeDoc(id: string): boolean {
  const docs = getStoreKnowledgeDocs();
  const filtered = docs.filter((d) => d.id !== id);
  if (filtered.length === docs.length) return false;

  cachedKnowledge = filtered;
  saveToFile('knowledge.json', filtered);
  return true;
}

// ---------------- SETTINGS ----------------

export function getStoreSettings(): StoreSettings {
  if (!cachedSettings) {
    cachedSettings = loadFromFile<StoreSettings>('settings.json', { ...DEFAULT_SETTINGS });
  }
  return cachedSettings;
}

export function updateStoreSettings(updates: Partial<StoreSettings>): StoreSettings {
  const current = getStoreSettings();
  const updated = { ...current, ...updates };
  cachedSettings = updated;
  saveToFile('settings.json', updated);
  return updated;
}

// ---------------- ORDERS ----------------

export function getStoreOrders(): StoreOrder[] {
  if (!cachedOrders) {
    cachedOrders = loadFromFile<StoreOrder[]>('orders.json', [...DEFAULT_ORDERS]);
  }
  return cachedOrders;
}

export function addStoreOrder(orderData: Omit<StoreOrder, 'id' | 'createdAt'>): StoreOrder {
  const orders = getStoreOrders();
  const newOrder: StoreOrder = {
    ...orderData,
    id: `ord-${Date.now().toString().slice(-6)}`,
    createdAt: 'Just now',
  };
  const updated = [newOrder, ...orders];
  cachedOrders = updated;
  saveToFile('orders.json', updated);
  return newOrder;
}

export function updateStoreOrderStatus(orderId: string, status: 'Confirmed' | 'Shipped' | 'Delivered'): StoreOrder | null {
  const orders = getStoreOrders();
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx === -1) return null;

  orders[idx].status = status;
  cachedOrders = [...orders];
  saveToFile('orders.json', cachedOrders);
  return orders[idx];
}
