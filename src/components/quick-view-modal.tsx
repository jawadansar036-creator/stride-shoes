'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Star, ShoppingBag, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { ProductItem } from '@/lib/products-data';
import { useCart } from '@/lib/cart-context';

interface QuickViewModalProps {
  product: ProductItem | null;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [added, setAdded] = useState(false);

  // Sync defaults when product changes
  React.useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[2] || product.sizes[0]);
      setSelectedColor(product.colors[0]);
      setSelectedImage(0);
      setAdded(false);
    }
  }, [product]);

  if (!product) return null;

  const handleAddToCart = () => {
    addItem(product, selectedSize, selectedColor, 1);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden z-10 animate-slide-up grid grid-cols-1 md:grid-cols-2">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 text-neutral-500 hover:text-black bg-white/80 backdrop-blur-md rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left: Gallery */}
          <div className="p-6 bg-neutral-50 flex flex-col justify-between">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white shadow-sm">
              <Image
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      selectedImage === idx ? 'border-black' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details & Selection */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-neutral-400">
                  {product.brand} · {product.category}
                </span>
                <h2 className="text-xl font-black text-neutral-900 mt-1">{product.name}</h2>

                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 text-xs font-bold text-neutral-900">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                  </div>
                  <span className="text-xs text-neutral-400">({product.reviewCount} reviews)</span>
                  <span className="text-neutral-300">·</span>
                  <span className="text-xs font-semibold text-emerald-600">In Stock</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-neutral-900">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-neutral-400 line-through">
                    ${product.originalPrice}
                  </span>
                )}
                {product.discount && (
                  <span className="text-xs bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded-md">
                    Save {product.discount}%
                  </span>
                )}
              </div>

              {/* Description snippet */}
              <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3">
                {product.description}
              </p>

              {/* Color Selector */}
              <div>
                <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                  Color: <span className="font-normal text-neutral-600">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {product.colors.map((col) => (
                    <button
                      key={col}
                      onClick={() => setSelectedColor(col)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                        selectedColor === col
                          ? 'bg-black text-white border-black'
                          : 'border-neutral-200 text-neutral-700 hover:border-neutral-400'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div>
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-neutral-800 uppercase tracking-wider">Select Size (US)</label>
                  <span className="text-neutral-500 font-medium">True to Size</span>
                </div>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        selectedSize === sz
                          ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                          : 'border-neutral-200 text-neutral-800 hover:border-neutral-400'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-3 pt-4 border-t border-neutral-100">
              <button
                onClick={handleAddToCart}
                className={`w-full py-3.5 text-sm font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-black hover:bg-neutral-800 text-white'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart · ${product.price}</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  30-day wear trial
                </span>
                <Link
                  href={`/product/${product.id}`}
                  onClick={onClose}
                  className="font-bold text-neutral-900 hover:underline flex items-center gap-1"
                >
                  <span>Full product page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
