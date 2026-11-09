'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  RotateCcw, 
  Truck, 
  Flame, 
  Check, 
  Star,
  Layers,
  ChevronRight
} from 'lucide-react';
import { PRODUCTS, ProductItem } from '@/lib/products-data';
import { ProductCard } from '@/components/product-card';
import { QuickViewModal } from '@/components/quick-view-modal';
import { ChatWidget } from '@/components/ai-chat/chat-widget';

export default function HomePage() {
  const [quickViewProduct, setQuickViewProduct] = useState<ProductItem | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<ProductItem[]>(PRODUCTS);
  const [settings, setSettings] = useState({
    heroTitle: 'Find Your Perfect Pair.',
    heroSubtitle: 'Premium footwear engineered for every step. From marathon carbon plates to hand-stitched Italian leather, discover unmatched propulsion and effortless comfort.',
  });

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((d) => {
        if (d?.products && Array.isArray(d.products)) {
          setAllProducts(d.products);
        }
      })
      .catch(() => {});

    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d?.settings) {
          setSettings((prev) => ({
            ...prev,
            heroTitle: d.settings.heroTitle || prev.heroTitle,
            heroSubtitle: d.settings.heroSubtitle || prev.heroSubtitle,
          }));
        }
      })
      .catch(() => {});
  }, []);

  const featuredProducts = allProducts.filter((p) => p.isFeatured).slice(0, 4);
  const newArrivals = allProducts.filter((p) => p.isNewArrival).slice(0, 4);
  const bestSellers = allProducts.filter((p) => p.isBestSeller).slice(0, 4);

  const categories = [
    {
      title: 'Road Running',
      subtitle: 'Carbon Propulsion',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
      href: '/shop?category=Running',
    },
    {
      title: 'Lifestyle Minimalist',
      subtitle: 'Italian Full-Grain Leather',
      image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop',
      href: '/shop?category=Lifestyle',
    },
    {
      title: 'Mountain Trail',
      subtitle: 'Vibram & GORE-TEX',
      image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=800&auto=format&fit=crop',
      href: '/shop?category=Trail',
    },
    {
      title: 'Court & Basketball',
      subtitle: 'Air Zoom Agility',
      image: 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?q=80&w=800&auto=format&fit=crop',
      href: '/shop?category=Basketball',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative bg-neutral-950 text-white overflow-hidden">
        {/* Subtle grid background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-300">
                <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                <span>Next-Gen Supercritical Nitrogen Foam</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-white">
                {settings.heroTitle}
              </h1>

              <p className="text-base sm:text-lg text-neutral-400 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                {settings.heroSubtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-4">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-neutral-200 text-black font-extrabold text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-105 group"
                >
                  <span>Shop Collection</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <button
                  onClick={() => setChatOpen(true)}
                  className="w-full sm:w-auto px-7 py-4 bg-neutral-900/90 hover:bg-neutral-800 text-white font-bold text-sm rounded-2xl border border-neutral-800 shadow-lg flex items-center justify-center gap-2.5 transition-all hover:border-neutral-600 group"
                >
                  <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                  <span>Ask AI Assistant</span>
                </button>
              </div>

              {/* Trust badges */}
              <div className="pt-6 flex items-center justify-center lg:justify-start gap-6 text-xs text-neutral-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Free Shipping $75+</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>30-Day Wear Trial</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>1-Year Warranty</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square w-full rounded-3xl overflow-hidden bg-gradient-to-tr from-neutral-900 to-neutral-800 shadow-2xl border border-neutral-800 group">
                <Image
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop"
                  alt="Stride AeroGlide Elite Carbon"
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Floating Product Tag */}
                <div className="absolute bottom-4 left-4 right-4 bg-neutral-950/80 backdrop-blur-md p-4 rounded-2xl border border-neutral-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-accent tracking-widest">
                      Flagship Marathon Shoe
                    </span>
                    <h4 className="text-sm font-bold text-white">Stride AeroGlide Elite Carbon</h4>
                    <p className="text-xs text-neutral-400">$185 · Nitrogen Supercritical Foam</p>
                  </div>
                  <Link
                    href="/product/prod-001"
                    className="p-2.5 bg-white text-black rounded-xl hover:bg-neutral-200 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-accent">Curated Disciplines</span>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight mt-1">
              Explore by Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold text-neutral-900 hover:text-black flex items-center gap-1 group"
          >
            <span>Browse All Categories</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-neutral-100 shadow-sm hover:shadow-xl transition-all duration-300 block"
            >
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-[10px] uppercase font-bold tracking-wider text-neutral-300">
                  {cat.subtitle}
                </p>
                <h3 className="text-base sm:text-lg font-black tracking-tight mt-0.5">{cat.title}</h3>
                <div className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-white/90 group-hover:text-white">
                  <span>Shop Now</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS CAROUSEL / GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-accent">Editor&apos;s Picks</span>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight mt-1">
              Featured Footwear
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold text-neutral-900 hover:text-black flex items-center gap-1 group"
          >
            <span>View All {allProducts.length} Models</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* 4. RAG AI ASSISTANT INTERACTIVE CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-neutral-900 text-white p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl border border-neutral-800">
          {/* Subtle glowing radial background */}
          <div className="absolute -right-24 -top-24 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-800 rounded-full text-xs font-bold text-accent">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Retrieval-Augmented Generation (RAG)</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Meet Your Personal <br />
              AI Shoe Specialist.
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 font-normal leading-relaxed">
              Don&apos;t guess your size or settle for the wrong midsole. Our AI concierge uses real-time vector retrieval across our catalog, marathon research, and sizing data to recommend the exact shoe for your stride.
            </p>

            {/* Quick Interactive Prompt Chips */}
            <div className="pt-2 flex flex-wrap gap-2">
              <button
                onClick={() => setChatOpen(true)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-xl font-medium transition-colors border border-neutral-700"
              >
                &ldquo;What are the best shoes for wide feet?&rdquo;
              </button>
              <button
                onClick={() => setChatOpen(true)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-xl font-medium transition-colors border border-neutral-700"
              >
                &ldquo;Do you have carbon plate shoes under $200?&rdquo;
              </button>
              <button
                onClick={() => setChatOpen(true)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-xl font-medium transition-colors border border-neutral-700"
              >
                &ldquo;Explain your 30-day wear trial policy&rdquo;
              </button>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setChatOpen(true)}
                className="px-8 py-4 bg-white text-black font-black text-sm rounded-2xl hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-lg hover:scale-105"
              >
                <Sparkles className="w-4 h-4 text-accent" />
                <span>Chat with AI Specialist</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NEW ARRIVALS & BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* New Arrivals */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-600">Fresh Drops</span>
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight mt-1">
                New Arrivals
              </h2>
            </div>
            <Link
              href="/shop?sort=newest"
              className="text-xs font-bold text-neutral-900 hover:text-black flex items-center gap-1 group"
            >
              <span>See All New</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {newArrivals.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        </div>

        {/* Best Sellers */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-red-600">Community Favorites</span>
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight mt-1">
                Best Sellers
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-bold text-neutral-900 hover:text-black flex items-center gap-1 group"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {bestSellers.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHY SHOP WITH US */}
      <section className="bg-neutral-50 py-16 sm:py-20 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-extrabold tracking-wider text-accent">The Stride Standard</span>
            <h2 className="text-2xl sm:text-4xl font-black text-neutral-900 tracking-tight mt-1">
              Engineered for Zero Compromise
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-2">
              Every detail is calibrated for athletic performance, durability, and supreme comfort.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-accent flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-neutral-900">Supercritical Nitrogen Rebound</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Microscopic closed-cell nitrogen foam returns 85% kinetic energy on impact, 30% lighter than standard EVA foams.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-neutral-900">30-Day &ldquo;Run In Them&rdquo; Trial</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                We believe you must test shoes on real pavement. Put 50 miles on them. If they aren&apos;t perfect, return or exchange for free.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-neutral-900">1-Year Defect Warranty</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Every pair is protected for 365 days against manufacturing defects, sole separation, and stitching flaws.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Chat Widget */}
      <ChatWidget isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}
