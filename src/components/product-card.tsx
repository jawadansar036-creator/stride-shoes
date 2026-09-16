'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Eye, ShoppingBag, Heart, Check } from 'lucide-react';
import { ProductItem } from '@/lib/products-data';
import { useCart } from '@/lib/cart-context';

interface ProductCardProps {
  product: ProductItem;
  onQuickView?: (product: ProductItem) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const { addItem } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Quick add default size & color
    const defaultSize = product.sizes[2] || product.sizes[0];
    const defaultColor = product.colors[0];
    addItem(product, defaultSize, defaultColor, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  const currentImage = isHovered && product.images.length > 1 ? product.images[1] : product.images[0];

  return (
    <div
      className="group relative flex flex-col bg-white rounded-2xl border border-neutral-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-neutral-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges & Favorite Button */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {product.discount && (
          <span className="bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
            {product.discount}% OFF
          </span>
        )}
        {product.isBestSeller && !product.discount && (
          <span className="bg-black text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
            Bestseller
          </span>
        )}
        {product.isNewArrival && !product.isBestSeller && !product.discount && (
          <span className="bg-accent text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
            New
          </span>
        )}
      </div>

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsLiked(!isLiked);
        }}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all ${
          isLiked
            ? 'bg-red-50 text-red-500 shadow-sm scale-110'
            : 'bg-white/80 text-neutral-500 hover:text-black hover:bg-white'
        }`}
        aria-label="Save to favorites"
      >
        <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
      </button>

      {/* Image Container with Link */}
      <Link href={`/product/${product.id}`} className="relative aspect-square w-full bg-neutral-100 overflow-hidden block">
        <Image
          src={currentImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          priority={product.isFeatured}
        />

        {/* Quick Action Overlay (Desktop) */}
        <div className="absolute inset-x-3 bottom-3 hidden sm:flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleQuickAdd}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-neutral-900 hover:bg-black text-white'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </>
            )}
          </button>

          {onQuickView && (
            <button
              onClick={handleQuickViewClick}
              className="p-2 bg-white/95 hover:bg-white text-neutral-800 rounded-xl shadow-md transition-all hover:scale-105"
              aria-label="Quick view preview"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>
      </Link>

      {/* Details Section */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] text-neutral-500 font-medium mb-1">
            <span className="uppercase tracking-wider font-semibold text-neutral-600">{product.brand}</span>
            <span>{product.category} · {product.gender}</span>
          </div>

          {/* Product Title */}
          <Link href={`/product/${product.id}`}>
            <h3 className="text-sm font-bold text-neutral-900 group-hover:text-black line-clamp-1 tracking-tight">
              {product.name}
            </h3>
          </Link>

          {/* Color Options count */}
          <p className="text-[11px] text-neutral-400 mt-1">
            {product.colors.length} {product.colors.length === 1 ? 'Color' : 'Colors'} Available
          </p>
        </div>

        {/* Rating & Price Row */}
        <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between">
          {/* Price */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black text-neutral-900">${product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-neutral-400 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 text-xs font-semibold text-neutral-800">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{product.rating}</span>
            <span className="text-[10px] text-neutral-400 font-normal">({product.reviewCount})</span>
          </div>
        </div>

        {/* Mobile Quick Add Button */}
        <div className="mt-3 sm:hidden">
          <button
            onClick={handleQuickAdd}
            className={`w-full py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-neutral-100 active:bg-neutral-200 text-neutral-900'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
