'use client';

import React, { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Star, 
  ShoppingBag, 
  Check, 
  Sparkles, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Heart, 
  Plus, 
  Minus,
  Ruler,
  ChevronRight,
  Info
} from 'lucide-react';
import { PRODUCTS, ProductItem } from '@/lib/products-data';
import { useCart } from '@/lib/cart-context';
import { ProductCard } from '@/components/product-card';
import { ChatWidget } from '@/components/ai-chat/chat-widget';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<ProductItem | null>(() => {
    return PRODUCTS.find((p) => p.id === resolvedParams.id || p.slug === resolvedParams.id) || null;
  });
  const [loading, setLoading] = useState(!product);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data?.products) {
          const found = data.products.find((p: ProductItem) => p.id === resolvedParams.id || p.slug === resolvedParams.id);
          if (found) {
            setProduct(found);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [resolvedParams.id]);

  if (!product && !loading) {
    notFound();
  }

  if (!product) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-neutral-500">Loading shoe details...</div>;
  }

  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[2] || product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'shipping'>('details');
  const [chatOpen, setChatOpen] = useState(false);

  const handleAddToCart = () => {
    addItem(product, selectedSize, selectedColor, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  // Find related products in same category
  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.gender === product.gender)
  ).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
        <Link href="/" className="hover:text-black">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-black">Shop</Link>
        <span>/</span>
        <Link href={`/shop?category=${product.category}`} className="hover:text-black">{product.category}</Link>
        <span>/</span>
        <span className="text-neutral-900 font-semibold truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Product Section: Gallery + Purchase Config */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Image Gallery (7 cols on large) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square w-full rounded-3xl bg-neutral-100 overflow-hidden shadow-sm border border-neutral-200">
            <Image
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              fill
              priority
              className="object-cover object-center transition-all duration-300"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              {product.discount && (
                <span className="bg-red-600 text-white text-xs font-black uppercase px-2.5 py-1 rounded-md shadow-sm">
                  Save {product.discount}%
                </span>
              )}
              {product.isBestSeller && !product.discount && (
                <span className="bg-black text-white text-xs font-bold uppercase px-2.5 py-1 rounded-md shadow-sm">
                  Bestseller
                </span>
              )}
            </div>

            {/* Favorite button */}
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all ${
                isLiked ? 'bg-red-50 text-red-500 scale-110 shadow' : 'bg-white/80 text-neutral-600 hover:text-black hover:bg-white'
              }`}
              aria-label="Save to favorites"
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Thumbnails Row */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-20 sm:w-24 aspect-square rounded-2xl overflow-hidden bg-neutral-100 border-2 transition-all shrink-0 ${
                    selectedImage === idx
                      ? 'border-neutral-900 shadow-md scale-95'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details, Selection & Add To Cart (5 cols on large) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-neutral-500 font-semibold uppercase tracking-wider mb-2">
              <span>{product.brand}</span>
              <span>{product.category} · {product.gender}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Rating & Review Summary */}
            <div className="flex items-center gap-2 mt-2.5">
              <div className="flex items-center gap-1 text-sm font-bold text-neutral-900">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
              </div>
              <span className="text-xs text-neutral-400">({product.reviewCount} customer reviews)</span>
              <span className="text-neutral-300">·</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                In Stock & Ready to Ship
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 py-2 border-y border-neutral-100">
            <span className="text-3xl font-black text-neutral-900">${product.price}</span>
            {product.originalPrice && (
              <span className="text-base text-neutral-400 line-through">
                ${product.originalPrice}
              </span>
            )}
            {product.discount && (
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                ${product.originalPrice! - product.price} Discount
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            {product.description}
          </p>

          {/* Color Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Colorway: <span className="font-semibold text-neutral-600">{selectedColor}</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`text-xs px-3.5 py-2 rounded-xl border font-semibold transition-all ${
                    selectedColor === color
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                      : 'border-neutral-200 text-neutral-800 hover:border-neutral-400 bg-white'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-neutral-900 uppercase tracking-wider">Select US Size</label>
              <button
                onClick={() => setChatOpen(true)}
                className="text-accent hover:underline flex items-center gap-1 font-semibold"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Need Fit Advice? Ask AI</span>
              </button>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`py-2.5 text-xs font-black rounded-xl border transition-all ${
                    selectedSize === sz
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm scale-105'
                      : 'border-neutral-200 text-neutral-800 hover:border-neutral-400 bg-white'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Add to Cart Controls */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center gap-3">
              {/* Quantity Stepper */}
              <div className="flex items-center border border-neutral-200 rounded-xl bg-white p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-neutral-500 hover:text-black"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-bold text-neutral-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-neutral-500 hover:text-black"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-4 px-6 rounded-2xl font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all ${
                  justAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-black hover:bg-neutral-800 text-white hover:scale-[1.02]'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag · ${(product.price * quantity).toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>

            {/* Ask AI shortcut banner */}
            <button
              onClick={() => setChatOpen(true)}
              className="w-full py-3 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Ask AI if {product.name} is right for your feet</span>
            </button>
          </div>

          {/* Store Guarantees Ribbon */}
          <div className="pt-4 border-t border-neutral-100 grid grid-cols-2 gap-3 text-xs text-neutral-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-accent shrink-0" />
              <span>Free Shipping on $75+</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>30-Day Outdoor Wear Trial</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
              <span>1-Year Defect Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-neutral-400 shrink-0" />
              <span>100% Genuine Stride Footwear</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs / Accordion: Features, Specs, Shipping */}
      <div className="border-t border-neutral-200 pt-12 space-y-6">
        <div className="flex border-b border-neutral-200 gap-8">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'details'
                ? 'border-black text-black'
                : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            Features & Highlights
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'specs'
                ? 'border-black text-black'
                : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'shipping'
                ? 'border-black text-black'
                : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            Shipping & 30-Day Trial
          </button>
        </div>

        {/* Tab Content */}
        <div className="pt-2 text-xs sm:text-sm text-neutral-700 leading-relaxed max-w-4xl">
          {activeTab === 'details' && (
            <div className="space-y-4">
              <p>{product.description}</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase text-neutral-400">Brand</span>
                  <p className="font-bold text-neutral-900 mt-0.5">{product.brand}</p>
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase text-neutral-400">Category</span>
                  <p className="font-bold text-neutral-900 mt-0.5">{product.category}</p>
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase text-neutral-400">Intended User</span>
                  <p className="font-bold text-neutral-900 mt-0.5">{product.gender}</p>
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase text-neutral-400">Sizing Reliability</span>
                  <p className="font-bold text-neutral-900 mt-0.5">92% True to Size</p>
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase text-neutral-400">Insole</span>
                  <p className="font-bold text-neutral-900 mt-0.5">Removable Ortho-Molded</p>
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase text-neutral-400">Warranty</span>
                  <p className="font-bold text-neutral-900 mt-0.5">365-Day Guarantee</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-4">
              <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-2">
                <h4 className="font-bold text-neutral-900 text-sm">30-Day Outdoor Wear Test Trial</h4>
                <p className="text-xs text-neutral-600">
                  You can wear your {product.name} outside on trails, asphalt, or gyms for 30 full days. If they don&apos;t match your comfort needs, initiate a completely free prepaid exchange or return online.
                </p>
              </div>
              <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-2">
                <h4 className="font-bold text-neutral-900 text-sm">Fast Ground & Expedited Delivery</h4>
                <p className="text-xs text-neutral-600">
                  Orders over $75 qualify for <strong>FREE standard delivery</strong> (3-5 business days). Expedited 2-day delivery is available at checkout for $14.99.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-neutral-200 pt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-accent">Complete Your Lineup</span>
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight mt-1">
                You May Also Like
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-bold text-neutral-900 hover:text-black flex items-center gap-1"
            >
              <span>View All Shoes</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Chat Widget for In-Page AI Questions */}
      <ChatWidget isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}
