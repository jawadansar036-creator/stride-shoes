'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  ShoppingBag, 
  Sparkles, 
  Search, 
  Menu, 
  X, 
  ChevronRight, 
  Heart, 
  ShieldCheck, 
  Truck,
  SlidersHorizontal
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export function Navbar({ onOpenChat }: { onOpenChat?: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [announcement, setAnnouncement] = useState('Free Express Shipping on Orders Over $75 | 30-Day "Run In Them" Trial Guarantee');
  const { totalItems, openCart } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d?.settings?.announcementText) {
          setAnnouncement(d.settings.announcementText);
        }
      })
      .catch(() => {});
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Shop All', href: '/shop' },
    { label: 'Men', href: '/shop?gender=Men' },
    { label: 'Women', href: '/shop?gender=Women' },
    { label: 'Running', href: '/shop?category=Running' },
    { label: 'Lifestyle', href: '/shop?category=Lifestyle' },
    { label: 'Trail', href: '/shop?category=Trail' },
    { label: 'Kids', href: '/shop?gender=Kids' },
  ];

  return (
    <>
      {/* Top Notification Bar */}
      <div className="bg-neutral-900 text-neutral-300 text-xs py-2 px-4 font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex-1 text-center sm:text-left truncate">
            <span className="inline-flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-accent" />
              <span>{announcement}</span>
            </span>
          </div>
          <Link
            href="/admin"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white text-[11px] font-bold transition-colors shrink-0"
          >
            <SlidersHorizontal className="w-3 h-3 text-accent" />
            <span>Admin Portal</span>
          </Link>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-200 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 text-neutral-700 hover:text-black rounded-lg focus:outline-none"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-black text-white rounded-xl flex items-center justify-center font-black text-lg tracking-tighter shadow-sm group-hover:scale-105 transition-transform">
              S
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900 uppercase">
                STRIDE
              </span>
              <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-semibold -mt-1 hidden sm:block">
                FOOTWEAR LAB
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-sm font-semibold tracking-tight transition-colors hover:text-black ${
                    isActive ? 'text-black font-bold' : 'text-neutral-600'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-full transition-colors"
              aria-label="Search shoes"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Admin Portal Shortcut */}
            <Link
              href="/admin"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 sm:px-3 sm:py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs sm:text-sm font-semibold rounded-full transition-colors"
              title="Admin Dashboard"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-600" />
              <span>Admin</span>
            </Link>

            {/* AI Assistant Trigger (Desktop & Mobile) */}
            <button
              onClick={onOpenChat}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-neutral-900 hover:bg-black text-white text-xs sm:text-sm font-semibold rounded-full shadow-sm hover:shadow transition-all group"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
              <span className="hidden sm:inline">Ask AI</span>
              <span className="sm:hidden text-xs">AI</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2 text-neutral-800 hover:text-black hover:bg-neutral-100 rounded-full transition-colors"
              aria-label="View shopping cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm animate-fade-in">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Quick Search Dropdown */}
        {searchOpen && (
          <div className="border-t border-neutral-200 bg-white px-4 py-3 sm:py-4 shadow-md animate-fade-in">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-3">
              <Search className="w-5 h-5 text-neutral-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by shoe name, category, brand, or feature (e.g., carbon plate, trail, wide)..."
                className="w-full text-sm sm:text-base border-none focus:outline-none bg-transparent placeholder-neutral-400 text-neutral-900"
                autoFocus
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-black text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-colors"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-fade-in">
            <div>
              {/* Drawer Header */}
              <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-black text-white rounded-lg flex items-center justify-center font-black text-sm">
                    S
                  </div>
                  <span className="font-black text-lg tracking-tight">STRIDE</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-neutral-500 hover:text-black rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Search Form */}
              <div className="p-4 border-b border-neutral-100">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search footwear..."
                    className="w-full pl-9 pr-4 py-2.5 bg-neutral-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                </form>
              </div>

              {/* Drawer Links */}
              <nav className="p-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold text-neutral-800 hover:bg-neutral-100 transition-colors"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </Link>
                ))}
              </nav>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="p-5 border-t border-neutral-200 space-y-3 bg-neutral-50">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-900 text-xs font-bold rounded-xl transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-700" />
                <span>Admin Dashboard & Website Controls</span>
              </Link>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenChat?.();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 bg-black text-white text-sm font-semibold rounded-xl shadow hover:bg-neutral-800 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-accent" />
                <span>Ask AI Shopping Assistant</span>
              </button>

              <div className="text-xs text-neutral-500 text-center space-y-1 pt-2">
                <p>📞 7-Day Live Support Available</p>
                <p>30-Day &quot;Run In Them&quot; Trial Guarantee</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
