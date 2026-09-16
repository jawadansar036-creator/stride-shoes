'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, shipping, tax, total, totalItems } = useCart();
  const router = useRouter();

  const freeShippingThreshold = 75;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400 mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Your Cart is Empty</h1>
        <p className="text-sm text-neutral-500 max-w-sm mx-auto">
          Explore our latest collection of marathon shoes, Italian leather sneakers, and trail runners.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-black text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition-colors shadow-lg"
        >
          <span>Shop Shoes</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-4xl font-black text-neutral-900 tracking-tight">
          Your Shopping Bag ({totalItems} {totalItems === 1 ? 'item' : 'items'})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Cart Items List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Free Shipping Progress */}
          <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <Truck className={`w-4 h-4 ${amountToFreeShipping === 0 ? 'text-emerald-500' : 'text-accent'}`} />
              {amountToFreeShipping === 0 ? (
                <span className="text-emerald-700 font-bold">You qualify for FREE Standard Delivery! 🎉</span>
              ) : (
                <span className="text-neutral-700">
                  Add <strong className="text-neutral-900">${amountToFreeShipping.toFixed(2)}</strong> more to get <strong>FREE Shipping</strong>
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

          {/* Items */}
          <div className="bg-white rounded-3xl border border-neutral-200 divide-y divide-neutral-100 overflow-hidden shadow-sm">
            {items.map((item) => (
              <div key={`${item.productId}-${item.size}-${item.color}`} className="p-4 sm:p-6 flex gap-4 sm:gap-6">
                <div className="relative w-24 sm:w-28 aspect-square bg-neutral-100 rounded-2xl overflow-hidden shrink-0">
                  <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">
                        {item.product.brand} · {item.product.category}
                      </span>
                      <Link href={`/product/${item.product.id}`} className="text-sm sm:text-base font-bold text-neutral-900 hover:underline block">
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-neutral-500 mt-1">
                        Size: <strong>{item.size}</strong> · Color: <strong>{item.color}</strong>
                      </p>
                    </div>

                    <span className="text-base font-black text-neutral-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-neutral-200 rounded-xl bg-white p-1">
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                        className="p-1.5 text-neutral-500 hover:text-black"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-neutral-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                        className="p-1.5 text-neutral-500 hover:text-black"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.productId, item.size, item.color)}
                      className="text-neutral-400 hover:text-red-600 p-2 transition-colors flex items-center gap-1 text-xs"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Order Summary (5 cols) */}
        <div className="lg:col-span-5 bg-neutral-50 p-6 sm:p-8 rounded-3xl border border-neutral-200 space-y-6">
          <h2 className="text-base font-bold text-neutral-900 pb-3 border-b border-neutral-200">
            Order Breakdown
          </h2>

          <div className="space-y-2 text-xs">
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
            <div className="flex justify-between text-base font-black text-neutral-900 pt-3 border-t border-neutral-200">
              <span>Estimated Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => router.push('/checkout')}
            className="w-full py-4 bg-black hover:bg-neutral-800 text-white font-black text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-2 text-xs text-neutral-500 space-y-2">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>30-Day &ldquo;Run In Them&rdquo; Outdoor Wear Trial</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
              <span>1-Year Defect Manufacturer Warranty</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
