'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Star, Check, ArrowUpRight } from 'lucide-react';
import { ProductItem } from '@/lib/products-data';
import { useCart } from '@/lib/cart-context';

export function ChatProductCard({ product }: { product: ProductItem }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleQuickAdd = () => {
    const defaultSize = product.sizes[2] || product.sizes[0];
    const defaultColor = product.colors[0];
    addItem(product, defaultSize, defaultColor, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow p-2.5 flex items-center gap-3">
      {/* Thumbnail */}
      <Link href={`/product/${product.id}`} className="relative w-16 h-16 bg-neutral-100 rounded-lg overflow-hidden shrink-0 block">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover"
        />
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-medium">
          <span className="uppercase tracking-wider font-semibold text-neutral-700">{product.brand}</span>
          <span>·</span>
          <span>{product.category}</span>
        </div>

        <Link href={`/product/${product.id}`} className="text-xs font-bold text-neutral-900 hover:underline line-clamp-1 block">
          {product.name}
        </Link>

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-black text-neutral-900">${product.price}</span>
            {product.originalPrice && (
              <span className="text-[10px] text-neutral-400 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          <div className="flex items-center gap-0.5 text-[10px] text-neutral-600 font-semibold">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{product.rating}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-1.5 shrink-0">
        <button
          onClick={handleQuickAdd}
          className={`p-1.5 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
            added
              ? 'bg-emerald-600 text-white'
              : 'bg-black text-white hover:bg-neutral-800'
          }`}
          title="Add to cart"
        >
          {added ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
        </button>

        <Link
          href={`/product/${product.id}`}
          className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg flex items-center justify-center transition-colors"
          title="View product details"
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
