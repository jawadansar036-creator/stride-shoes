'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    subtotal,
    shipping,
    tax,
    total,
    totalItems,
  } = useCart();
  const router = useRouter();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 75;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleCheckoutClick = () => {
    closeCart();
    router.push('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-slide-up">
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-neutral-900" />
                <h2 className="text-base font-bold text-neutral-900">
                  Your Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-1.5 text-neutral-400 hover:text-black rounded-lg transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            <div className="mt-3 bg-neutral-50 p-3 rounded-xl border border-neutral-100">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <Truck className={`w-4 h-4 ${amountToFreeShipping === 0 ? 'text-emerald-500' : 'text-accent'}`} />
                {amountToFreeShipping === 0 ? (
                  <span className="text-emerald-700 font-bold">You unlocked FREE Standard Shipping! 🎉</span>
                ) : (
                  <span className="text-neutral-700">
                    Add <strong className="text-neutral-900">${amountToFreeShipping.toFixed(2)}</strong> more for <strong>FREE shipping</strong>
                  </span>
                )}
              </div>
              <div className="w-full h-1.5 bg-neutral-200 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    amountToFreeShipping === 0 ? 'bg-emerald-500' : 'bg-accent'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Cart Items Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-neutral-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900">Your bag is empty</h3>
                  <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                    Explore our running shoes, lifestyle sneakers, and court classics.
                  </p>
                </div>
                <button
                  onClick={() => {
                    closeCart();
                    router.push('/shop');
                  }}
                  className="px-6 py-2.5 bg-black text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={`${item.productId}-${item.size}-${item.color}`} className="py-4 flex gap-4">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 bg-neutral-100 rounded-xl overflow-hidden shrink-0">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info & Stepper */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          href={`/product/${item.product.id}`}
                          onClick={closeCart}
                          className="text-xs font-bold text-neutral-900 hover:underline line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <span className="text-xs font-bold text-neutral-900 ml-2">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Size: {item.size} · {item.color}
                      </p>
                    </div>

                    {/* Quantity Stepper & Remove */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-neutral-200 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                          className="p-1 text-neutral-500 hover:text-black"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-neutral-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                          className="p-1 text-neutral-500 hover:text-black"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.productId, item.size, item.color)}
                        className="text-neutral-400 hover:text-red-600 p-1 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer Summary */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-neutral-200 bg-neutral-50/50 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Estimated Shipping</span>
                  <span>{shipping === 0 ? <strong className="text-emerald-600">FREE</strong> : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Estimated Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-neutral-900 pt-2 border-t border-neutral-200">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckoutClick}
                className="w-full py-3.5 bg-black hover:bg-neutral-900 text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all group"
              >
                <span>Checkout as Guest</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-[10px] text-center text-neutral-400">
                🔒 Secure SSL Checkout · 30-Day Risk-Free Wear Trial
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
