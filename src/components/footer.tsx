'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';

export function Footer({ onOpenChat }: { onOpenChat?: () => void }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-neutral-950 text-neutral-300 pt-16 pb-12 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Props Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-neutral-800">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-neutral-900 rounded-2xl text-accent shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm tracking-tight">Free Express Delivery</h4>
              <p className="text-xs text-neutral-400 mt-1">Free standard shipping on all orders over $75. Tracked via UPS & FedEx.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-neutral-900 rounded-2xl text-emerald-400 shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm tracking-tight">30-Day Wear Trial</h4>
              <p className="text-xs text-neutral-400 mt-1">Take your shoes for outdoor runs or walks. Free exchanges with prepaid labels.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-neutral-900 rounded-2xl text-sky-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm tracking-tight">1-Year Defect Warranty</h4>
              <p className="text-xs text-neutral-400 mt-1">Complete craftsmanship assurance against sole separation and manufacturing flaws.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-neutral-900 rounded-2xl text-amber-400 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm tracking-tight">AI Shoe Concierge</h4>
              <p className="text-xs text-neutral-400 mt-1">Instant RAG-powered guidance for marathon training, foot width, and fit.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-white text-black rounded-xl flex items-center justify-center font-black text-lg">
                S
              </div>
              <span className="text-2xl font-black tracking-tight text-white uppercase">STRIDE</span>
            </div>
            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
              Performance biomechanics engineered for the road, track, trail, and urban streets. Crafted with supercritical nitrogen foams and sustainable luxury Italian leathers.
            </p>
            
            {/* Newsletter */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                Join the Stride Club – 10% Off Your First Order
              </p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium py-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Welcome! Use code <strong>STRIDE10</strong> at checkout.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-white text-black font-semibold text-xs rounded-xl hover:bg-neutral-200 transition-colors flex items-center gap-1 shrink-0"
                  >
                    <span>Join</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Shop Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Collections</h5>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li><Link href="/shop?category=Running" className="hover:text-white transition-colors">Road & Marathon Running</Link></li>
              <li><Link href="/shop?category=Trail" className="hover:text-white transition-colors">Trail & Mountain Hiking</Link></li>
              <li><Link href="/shop?category=Lifestyle" className="hover:text-white transition-colors">Italian Leather Lifestyle</Link></li>
              <li><Link href="/shop?category=Basketball" className="hover:text-white transition-colors">Court & Basketball</Link></li>
              <li><Link href="/shop?category=Training" className="hover:text-white transition-colors">HIIT & CrossFit Metcon</Link></li>
              <li><Link href="/shop?category=Luxury" className="hover:text-white transition-colors">Aura Luxury Atelier</Link></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Help & Service</h5>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <button onClick={onOpenChat} className="text-accent hover:underline text-left">
                  Ask AI Shopping Assistant
                </button>
              </li>
              <li><Link href="/shop?category=Running" className="hover:text-white transition-colors">Sizing Chart & Widths</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">Track Order Status</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">Returns & 30-Day Trial</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">1-Year Warranty Claim</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">Care & Cleaning Guide</Link></li>
              <li><Link href="/admin" className="text-neutral-300 hover:text-white font-bold transition-colors pt-1 block">🔐 Store Admin Panel</Link></li>
            </ul>
          </div>

          {/* Brand & Sustainability */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">About Stride</h5>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li><span className="text-neutral-400">Supercritical Foam Lab</span></li>
              <li><span className="text-neutral-400">Soles4Good Youth Charity</span></li>
              <li><span className="text-neutral-400">Sustainable Italian Tannery</span></li>
              <li><span className="text-neutral-400">Store Locations</span></li>
              <li><span className="text-neutral-400">Careers at Stride</span></li>
            </ul>
          </div>
        </div>

        {/* Copyright & Disclaimers */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} STRIDE Footwear Inc. All rights reserved. Powered by RAG AI Technology.</p>
          <div className="flex gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
