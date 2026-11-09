'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Sparkles, 
  Database, 
  TrendingUp, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ArrowUpRight, 
  Search, 
  Plus,
  Trash2,
  Edit3,
  X,
  Save,
  Globe,
  SlidersHorizontal,
  Layers,
  Tag,
  Check,
  Eye
} from 'lucide-react';
import { ProductItem } from '@/lib/products-data';
import { KnowledgeDoc } from '@/lib/knowledge-base';

interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  shippingAddress?: string;
  city?: string;
  itemsCount: number;
  itemsSummary: string;
  total: number;
  status: 'Confirmed' | 'Shipped' | 'Delivered';
  createdAt: string;
}

interface StoreSettings {
  announcementText: string;
  freeShippingThreshold: number;
  promoCode: string;
  promoDiscount: number;
  heroTitle: string;
  heroSubtitle: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'settings' | 'ai' | 'orders'>('products');
  
  // Data states
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeDoc[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [settings, setSettings] = useState<StoreSettings>({
    announcementText: 'Free Express Shipping on Orders Over $75 | 30-Day "Run In Them" Trial Guarantee',
    freeShippingThreshold: 75,
    promoCode: 'STRIDE10',
    promoDiscount: 10,
    heroTitle: 'Find Your Perfect Pair.',
    heroSubtitle: 'Premium footwear engineered for every step. Supercritical nitrogen foam & carbon propulsion.',
  });
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modals state
  const [editProductModal, setEditProductModal] = useState<ProductItem | null>(null);
  const [addProductModal, setAddProductModal] = useState(false);
  const [editDocModal, setEditDocModal] = useState<KnowledgeDoc | null>(null);
  const [addDocModal, setAddDocModal] = useState(false);

  // AI sandbox state
  const [testQuery, setTestQuery] = useState('What is your return policy and wear trial?');
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [testCitations, setTestCitations] = useState<string[]>([]);
  const [testLoading, setTestLoading] = useState(false);
  const [isReindexing, setIsReindexing] = useState(false);

  // Load live data from API
  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, knowRes, settRes, ordRes] = await Promise.all([
        fetch('/api/admin/products').then((r) => r.json()),
        fetch('/api/admin/knowledge').then((r) => r.json()),
        fetch('/api/admin/settings').then((r) => r.json()),
        fetch('/api/admin/orders').then((r) => r.json()),
      ]);

      if (prodRes?.products) setProducts(prodRes.products);
      if (knowRes?.docs) setKnowledgeDocs(knowRes.docs);
      if (settRes?.settings) setSettings(settRes.settings);
      if (ordRes?.orders) setOrders(ordRes.orders);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // ---------------- PRODUCT HANDLERS ----------------

  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const id = formData.get('id') as string;

    const payload = {
      id: id || undefined,
      name: formData.get('name'),
      brand: formData.get('brand'),
      category: formData.get('category'),
      gender: formData.get('gender'),
      price: formData.get('price'),
      originalPrice: formData.get('originalPrice') || undefined,
      discount: formData.get('discount') || undefined,
      description: formData.get('description'),
      features: (formData.get('features') as string).split('\n').filter(Boolean),
      images: [(formData.get('image') as string) || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop'],
      colors: (formData.get('colors') as string).split(',').map((c) => c.trim()).filter(Boolean),
      sizes: (formData.get('sizes') as string).split(',').map((s) => s.trim()).filter(Boolean),
      inStock: formData.get('inStock') === 'on',
      isFeatured: formData.get('isFeatured') === 'on',
      isNewArrival: formData.get('isNewArrival') === 'on',
      isBestSeller: formData.get('isBestSeller') === 'on',
    };

    try {
      const res = await fetch('/api/admin/products', {
        method: id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showNotification(id ? 'Shoe product updated successfully!' : 'New shoe added to catalog!');
        setEditProductModal(null);
        setAddProductModal(false);
        loadData();
      } else {
        showNotification(data.error || 'Failed to save product', 'error');
      }
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  const handleToggleStock = async (product: ProductItem) => {
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: product.id, inStock: !product.inStock }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, inStock: !p.inStock } : p))
        );
        showNotification(`${product.name} is now ${!product.inStock ? 'In Stock' : 'Out of Stock'}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from the website catalog?`)) return;

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        showNotification(`"${name}" was deleted from the catalog.`);
      }
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  // ---------------- SETTINGS HANDLERS ----------------

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        showNotification('Website settings & banner text updated live!');
      }
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  // ---------------- KNOWLEDGE DOC HANDLERS ----------------

  const handleSaveDoc = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const id = formData.get('id') as string;

    const payload = {
      id: id || undefined,
      title: formData.get('title'),
      category: formData.get('category'),
      keywords: (formData.get('keywords') as string).split(',').map((k) => k.trim()).filter(Boolean),
      content: formData.get('content'),
    };

    try {
      const res = await fetch('/api/admin/knowledge', {
        method: id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showNotification(id ? 'Knowledge policy updated and re-indexed!' : 'New policy document added!');
        setEditDocModal(null);
        setAddDocModal(false);
        loadData();
      }
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  const handleDeleteDoc = async (id: string, title: string) => {
    if (!confirm(`Delete policy "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/knowledge?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setKnowledgeDocs((prev) => prev.filter((d) => d.id !== id));
        showNotification(`Policy document deleted.`);
      }
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  const handleReindex = async () => {
    setIsReindexing(true);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      if (res.ok) {
        showNotification('AI vectors successfully refreshed with all catalog & policy changes!');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsReindexing(false);
    }
  };

  const handleTestRAG = async () => {
    if (!testQuery.trim()) return;
    setTestLoading(true);
    setTestResponse(null);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: testQuery }),
      });
      const data = await res.json();
      setTestResponse(data.message || 'No response generated.');
      setTestCitations(data.citations || []);
    } catch (err: any) {
      setTestResponse(`Error: ${err.message}`);
    } finally {
      setTestLoading(false);
    }
  };

  // ---------------- ORDER HANDLERS ----------------

  const handleCycleOrderStatus = async (orderId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Confirmed' ? 'Shipped' : currentStatus === 'Shipped' ? 'Delivered' : 'Confirmed';
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: nextStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus as any } : o))
        );
        showNotification(`Order status updated to ${nextStatus}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Filtered products list
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 14250);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-50 p-4 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold animate-slide-up border ${
            notification.type === 'success'
              ? 'bg-neutral-900 text-white border-neutral-700'
              : 'bg-red-600 text-white border-red-500'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-black text-white flex items-center justify-center font-bold text-xs">
              S
            </div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-neutral-500">
              STRIDE WEBSITE CONTROL CENTER
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight mt-1">
            Store Management & Live Editor
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500">
            Make changes to shoe products, prices, website banners, store policies, and RAG AI knowledge.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Globe className="w-3.5 h-3.5 text-neutral-600" />
            <span>View Live Website</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => setAddProductModal(true)}
            className="px-4 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Shoe</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'products' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Product Catalog ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'settings' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Website Banners & Settings</span>
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'ai' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <Sparkles className="w-4 h-4 text-accent" />
          <span>RAG AI Knowledge & Policies ({knowledgeDocs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'orders' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'overview' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Analytics Overview</span>
        </button>
      </div>

      {/* ================= TAB 1: PRODUCT CATALOG MANAGER ================= */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products by title or brand..."
                className="w-full bg-neutral-100 border-none rounded-xl pl-9 pr-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            </div>

            <div className="flex items-center gap-3">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold text-neutral-800 focus:outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Running">Running</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Trail">Trail</option>
                <option value="Basketball">Basketball</option>
                <option value="Training">Training</option>
                <option value="Luxury">Luxury</option>
              </select>

              <button
                onClick={() => setAddProductModal(true)}
                className="px-4 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Shoe</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Shoe</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Sizes</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Flags</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 bg-neutral-100 rounded-xl overflow-hidden shrink-0 border border-neutral-200">
                          <Image src={p.images[0]} alt="" fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900 line-clamp-1">{p.name}</p>
                          <p className="text-[11px] text-neutral-400">{p.brand} · {p.gender}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 font-semibold text-neutral-700">{p.category}</td>
                    <td className="py-3">
                      <span className="font-black text-neutral-900">${p.price}</span>
                      {p.originalPrice && (
                        <span className="text-[11px] text-neutral-400 line-through ml-1.5">${p.originalPrice}</span>
                      )}
                    </td>
                    <td className="py-3 text-neutral-500 font-medium">{p.sizes.length} sizes</td>
                    <td className="py-3">
                      <button
                        onClick={() => handleToggleStock(p)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                          p.inStock
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-red-50 text-red-700 hover:bg-red-100'
                        }`}
                      >
                        {p.inStock ? '✓ In Stock' : '✕ Out of Stock'}
                      </button>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        {p.isFeatured && <span className="bg-neutral-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">Featured</span>}
                        {p.isBestSeller && <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded">Bestseller</span>}
                        {p.isNewArrival && <span className="bg-blue-100 text-blue-800 text-[9px] font-bold px-1.5 py-0.5 rounded">New</span>}
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          href={`/product/${p.id}`}
                          target="_blank"
                          className="p-1.5 text-neutral-500 hover:text-black hover:bg-neutral-100 rounded-lg"
                          title="Preview product on website"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setEditProductModal(p)}
                          className="p-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-lg"
                          title="Edit shoe details"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete shoe"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 2: WEBSITE SETTINGS & BANNERS ================= */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="pb-4 border-b border-neutral-200 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-neutral-900">Website Content & Settings</h3>
              <p className="text-xs text-neutral-500">Edit the live announcement bar, hero section headlines, promo discounts, and free shipping rules.</p>
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Website Changes</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Announcement Bar */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">Top Header Announcement Bar</label>
              <input
                type="text"
                value={settings.announcementText}
                onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <p className="text-[11px] text-neutral-400">Displays at the very top of every page above the navigation menu.</p>
            </div>

            {/* Hero Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">Home Page Hero Title</label>
              <input
                type="text"
                value={settings.heroTitle}
                onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Free Shipping Threshold */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">Free Shipping Threshold ($ USD)</label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: parseFloat(e.target.value) || 0 })}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Hero Subtitle */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">Home Page Hero Subtitle</label>
              <textarea
                rows={2}
                value={settings.heroSubtitle}
                onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Promo Code */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">Checkout Promo Code</label>
              <input
                type="text"
                value={settings.promoCode}
                onChange={(e) => setSettings({ ...settings, promoCode: e.target.value.toUpperCase() })}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-900 uppercase focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Promo Discount % */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">Discount Percentage (%)</label>
              <input
                type="number"
                value={settings.promoDiscount}
                onChange={(e) => setSettings({ ...settings, promoDiscount: parseInt(e.target.value, 10) || 0 })}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
        </form>
      )}

      {/* ================= TAB 3: RAG AI KNOWLEDGE & POLICIES ================= */}
      {activeTab === 'ai' && (
        <div className="space-y-8">
          <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
              <div>
                <h3 className="text-base font-bold text-neutral-900">RAG Vector Knowledge Base ({knowledgeDocs.length} Chunks)</h3>
                <p className="text-xs text-neutral-500">Edit store policies, sizing advice, and warranty rules. Changes are automatically embedded into the vector store for the AI assistant.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAddDocModal(true)}
                  className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Policy</span>
                </button>
                <button
                  onClick={handleReindex}
                  disabled={isReindexing}
                  className="px-4 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isReindexing ? 'animate-spin' : ''}`} />
                  <span>Sync Vectors</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {knowledgeDocs.map((doc) => (
                <div key={doc.id} className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-neutral-200 text-neutral-800 rounded">
                        {doc.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditDocModal(doc)}
                          className="p-1 text-neutral-500 hover:text-black hover:bg-neutral-200 rounded"
                          title="Edit policy content"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteDoc(doc.id, doc.title)}
                          className="p-1 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Delete policy"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <h4 className="text-xs font-bold text-neutral-900 mt-2">{doc.title}</h4>
                    <p className="text-[11px] text-neutral-600 mt-1 line-clamp-3 leading-relaxed">
                      {doc.content.replace(/#/g, '').trim()}
                    </p>
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono">ID: {doc.id}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Live RAG AI Testing Sandbox */}
          <div className="bg-neutral-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800 text-accent text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>RAG Retrieval Sandbox</span>
              </div>
              <h3 className="text-xl font-black mt-2">Test Live AI Response to Policy Updates</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Ask any question to verify that the RAG AI chatbot retrieves your updated policies and catalog data accurately.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                placeholder="Ask about wide feet, shipping rates, 30-day trial..."
                className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-accent"
              />
              <button
                onClick={handleTestRAG}
                disabled={testLoading}
                className="px-6 py-3 bg-white hover:bg-neutral-200 text-black font-black text-xs rounded-xl shadow transition-all shrink-0"
              >
                {testLoading ? 'Retrieving...' : 'Run Query'}
              </button>
            </div>

            {testResponse && (
              <div className="bg-neutral-800/80 p-5 rounded-2xl border border-neutral-700 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-neutral-700">
                  <span className="font-bold text-accent">RAG Response Output:</span>
                  {testCitations.length > 0 && (
                    <span className="text-neutral-400 text-[11px]">
                      Grounded in: {testCitations.join(', ')}
                    </span>
                  )}
                </div>
                <div className="text-xs text-neutral-200 whitespace-pre-line leading-relaxed">
                  {testResponse}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 4: ORDERS ================= */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div>
              <h3 className="text-base font-bold text-neutral-900">Orders ({orders.length})</h3>
              <p className="text-xs text-neutral-500">Live stream of customer orders placed through the website.</p>
            </div>
            <span className="text-xs font-bold text-neutral-700 bg-neutral-100 px-3 py-1 rounded-full">
              Total Sales: ${totalRevenue.toLocaleString()}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Order Number</th>
                  <th className="pb-3">Customer Details</th>
                  <th className="pb-3">Items Summary</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-4 font-black text-neutral-900">{ord.orderNumber}</td>
                    <td className="py-4">
                      <div className="font-bold text-neutral-800">{ord.customerName}</div>
                      <div className="text-[11px] text-neutral-400">{ord.customerEmail}</div>
                      {ord.shippingAddress && (
                        <div className="text-[10px] text-neutral-500 mt-0.5">{ord.shippingAddress}, {ord.city}</div>
                      )}
                    </td>
                    <td className="py-4 text-neutral-600 max-w-xs truncate">{ord.itemsSummary || `${ord.itemsCount} pair(s)`}</td>
                    <td className="py-4 font-black text-neutral-900">${ord.total.toFixed(2)}</td>
                    <td className="py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                          ord.status === 'Confirmed'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : ord.status === 'Shipped'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-4 text-neutral-500">{ord.createdAt}</td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => handleCycleOrderStatus(ord.id, ord.status)}
                        className="text-xs font-bold text-black bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-xl transition-colors"
                      >
                        Advance Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 5: OVERVIEW ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Total Catalog</span>
              <p className="text-2xl font-black text-neutral-900">{products.length} Models</p>
              <p className="text-[11px] text-emerald-600 font-bold">{products.filter((p) => p.inStock).length} in stock</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Total Revenue</span>
              <p className="text-2xl font-black text-neutral-900">${totalRevenue.toLocaleString()}</p>
              <p className="text-[11px] text-neutral-400">Across online checkout</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Customer Orders</span>
              <p className="text-2xl font-black text-neutral-900">{orders.length}</p>
              <p className="text-[11px] text-blue-600 font-bold">100% automated</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">RAG AI Knowledge</span>
              <p className="text-2xl font-black text-neutral-900">{knowledgeDocs.length} Chunks</p>
              <p className="text-[11px] text-accent font-bold">Vectorized & Active</p>
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT / ADD PRODUCT MODAL ================= */}
      {(editProductModal || addProductModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setEditProductModal(null);
              setAddProductModal(false);
            }}
          />
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto space-y-5 animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-lg font-black text-neutral-900">
                {editProductModal ? `Edit Shoe: ${editProductModal.name}` : 'Add New Shoe to Store'}
              </h3>
              <button
                onClick={() => {
                  setEditProductModal(null);
                  setAddProductModal(false);
                }}
                className="p-1.5 text-neutral-400 hover:text-black rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              {editProductModal && <input type="hidden" name="id" value={editProductModal.id} />}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-700 uppercase">Shoe Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue={editProductModal?.name || ''}
                    placeholder="Stride AeroGlide Pro Carbon"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-700 uppercase">Brand</label>
                  <input
                    type="text"
                    name="brand"
                    required
                    defaultValue={editProductModal?.brand || 'Stride'}
                    placeholder="Stride"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-700 uppercase">Category</label>
                  <select
                    name="category"
                    defaultValue={editProductModal?.category || 'Running'}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-2 py-2 text-xs focus:outline-none"
                  >
                    <option value="Running">Running</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Trail">Trail</option>
                    <option value="Basketball">Basketball</option>
                    <option value="Training">Training</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-700 uppercase">Gender</label>
                  <select
                    name="gender"
                    defaultValue={editProductModal?.gender || 'Men'}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-2 py-2 text-xs focus:outline-none"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Unisex">Unisex</option>
                    <option value="Kids">Kids</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-700 uppercase">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    required
                    defaultValue={editProductModal?.price || ''}
                    placeholder="185.00"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-700 uppercase">Orig. Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="originalPrice"
                    defaultValue={editProductModal?.originalPrice || ''}
                    placeholder="220.00"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-700 uppercase">Image URL (Unsplash or CDN)</label>
                <input
                  type="url"
                  name="image"
                  required
                  defaultValue={editProductModal?.images[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop'}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-700 uppercase">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  required
                  defaultValue={editProductModal?.description || ''}
                  placeholder="Engineered for marathoners and tempo workouts with full carbon propulsion..."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-700 uppercase">Key Features (One per line)</label>
                <textarea
                  name="features"
                  rows={2}
                  defaultValue={editProductModal?.features.join('\n') || 'Full-length curved carbon plate\nNitrogen supercritical foam midsole\nContinental traction rubber'}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-700 uppercase">Available Sizes (comma separated)</label>
                  <input
                    type="text"
                    name="sizes"
                    defaultValue={editProductModal?.sizes.join(', ') || '7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12'}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-700 uppercase">Colorways (comma separated)</label>
                  <input
                    type="text"
                    name="colors"
                    defaultValue={editProductModal?.colors.join(', ') || 'Crimson Red / Carbon Black, Triple White'}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    name="inStock"
                    defaultChecked={editProductModal ? editProductModal.inStock : true}
                    className="rounded text-black focus:ring-black"
                  />
                  <span>In Stock</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    defaultChecked={editProductModal ? editProductModal.isFeatured : false}
                    className="rounded text-black focus:ring-black"
                  />
                  <span>Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    name="isNewArrival"
                    defaultChecked={editProductModal ? editProductModal.isNewArrival : true}
                    className="rounded text-black focus:ring-black"
                  />
                  <span>New Drop</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    name="isBestSeller"
                    defaultChecked={editProductModal ? editProductModal.isBestSeller : false}
                    className="rounded text-black focus:ring-black"
                  />
                  <span>Bestseller</span>
                </label>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditProductModal(null);
                    setAddProductModal(false);
                  }}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-black hover:bg-neutral-800 text-white font-bold rounded-xl shadow"
                >
                  Save Shoe to Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT / ADD KNOWLEDGE POLICY MODAL ================= */}
      {(editDocModal || addDocModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setEditDocModal(null);
              setAddDocModal(false);
            }}
          />
          <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl p-6 sm:p-8 z-10 space-y-4 animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-base font-black text-neutral-900">
                {editDocModal ? 'Edit Store Policy / Knowledge Chunk' : 'Add New Policy Document'}
              </h3>
              <button
                onClick={() => {
                  setEditDocModal(null);
                  setAddDocModal(false);
                }}
                className="p-1.5 text-neutral-400 hover:text-black rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDoc} className="space-y-4 text-xs">
              {editDocModal && <input type="hidden" name="id" value={editDocModal.id} />}

              <div className="space-y-1">
                <label className="font-bold text-neutral-700 uppercase">Policy Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={editDocModal?.title || ''}
                  placeholder="30-Day 'Run In Them' Wear Test Trial"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-700 uppercase">Category</label>
                  <select
                    name="category"
                    defaultValue={editDocModal?.category || 'shipping'}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-2 py-2 text-xs focus:outline-none"
                  >
                    <option value="shipping">shipping</option>
                    <option value="returns">returns</option>
                    <option value="sizing">sizing</option>
                    <option value="warranty">warranty</option>
                    <option value="care">care</option>
                    <option value="faq">faq</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-700 uppercase">Keywords (comma separated)</label>
                  <input
                    type="text"
                    name="keywords"
                    defaultValue={editDocModal?.keywords.join(', ') || 'returns, trial, exchange, refund'}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-700 uppercase">Full Content / Policy Rules</label>
                <textarea
                  name="content"
                  rows={6}
                  required
                  defaultValue={editDocModal?.content || ''}
                  placeholder="- Free returns within 30 days&#10;- Free prepaid exchange labels online&#10;- Wear them outside on pavement"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-black font-mono leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-neutral-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditDocModal(null);
                    setAddDocModal(false);
                  }}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-black hover:bg-neutral-800 text-white font-bold rounded-xl shadow"
                >
                  Save & Vectorize Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
