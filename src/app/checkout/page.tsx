'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  ArrowLeft, 
  Lock, 
  Tag,
  ShoppingBag,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function CheckoutPage() {
  const { items, subtotal, shipping: standardShipping, tax, total, clearCart } = useCart();
  const router = useRouter();

  // Form State
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [shippingSpeed, setShippingSpeed] = useState<'standard' | 'expedited' | 'overnight'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'applepay' | 'paypal'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState('');

  // Calculate dynamic shipping cost
  const shippingCost = shippingSpeed === 'standard'
    ? standardShipping
    : shippingSpeed === 'expedited'
    ? 14.99
    : 24.99;

  const discountAmount = (subtotal * discountPercent) / 100;
  const finalSubtotal = Math.max(0, subtotal - discountAmount);
  const finalTax = finalSubtotal * 0.08;
  const finalTotal = finalSubtotal + shippingCost + finalTax;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    if (promoCode.trim().toUpperCase() === 'STRIDE10') {
      setDiscountPercent(10);
      setPromoSuccess('Promo code STRIDE10 applied! 10% off.');
    } else {
      setPromoError('Invalid promo code. Try STRIDE10 for 10% off.');
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !firstName || !lastName || !address || !city || !zip) {
      alert('Please fill in all required shipping address fields.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const generatedOrderNum = `STR-${Math.floor(100000 + Math.random() * 900000)}`;
      setConfirmedOrderNumber(generatedOrderNum);
      
      // Save order to store database
      fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: generatedOrderNum,
          customerName: `${firstName} ${lastName}`,
          customerEmail: email,
          shippingAddress: address,
          city: `${city}, ${state} ${zip}`,
          itemsCount: items.reduce((acc, i) => acc + i.quantity, 0),
          itemsSummary: items.map((i) => `${i.product.name} (${i.size})`).join(', '),
          total: finalTotal,
          status: 'Confirmed',
        }),
      }).catch((err) => console.error('Failed to save order to admin DB:', err));

      setIsSubmitting(false);
      setOrderComplete(true);
      clearCart();
    }, 1200);
  };

  if (orderComplete) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-fade-in">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Order Confirmed</span>
          <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
            Thank You For Your Order!
          </h1>
          <p className="text-sm text-neutral-600 max-w-md mx-auto">
            Order <strong>#{confirmedOrderNumber}</strong> has been placed. We have sent a confirmation email to <strong>{email}</strong>.
          </p>
        </div>

        <div className="bg-neutral-50 p-6 rounded-3xl border border-neutral-200 max-w-lg mx-auto text-left space-y-4">
          <div className="flex justify-between items-center text-xs pb-3 border-b border-neutral-200">
            <span className="text-neutral-500">Delivery Method:</span>
            <span className="font-bold text-neutral-900 capitalize">{shippingSpeed} Shipping (3-5 Days)</span>
          </div>
          <div className="flex justify-between items-center text-xs pb-3 border-b border-neutral-200">
            <span className="text-neutral-500">Shipping To:</span>
            <span className="font-bold text-neutral-900">{firstName} {lastName}, {city}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-neutral-500">Total Paid:</span>
            <span className="text-base font-black text-neutral-900">${finalTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/shop"
            className="px-8 py-3.5 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="px-8 py-3.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold text-xs rounded-xl transition-all"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400 mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-neutral-900">Your bag is empty</h2>
        <p className="text-xs text-neutral-500">You need items in your cart to proceed to checkout.</p>
        <Link
          href="/shop"
          className="inline-block px-6 py-3 bg-black text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition-colors"
        >
          Explore Shoes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link href="/shop" className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-black font-semibold mb-6">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to shopping</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Checkout Form (7 cols) */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-8">
          {/* Step 1: Contact Information */}
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center font-bold">1</span>
                Contact Information
              </h2>
              <span className="text-xs text-neutral-500">Guest Checkout</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                Email Address for Order Confirmation
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="runner@stridefootwear.com"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          {/* Step 2: Shipping Address */}
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2 pb-3 border-b border-neutral-100">
              <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center font-bold">2</span>
              Shipping Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Alex"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Morgan"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">Street Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="100 Marathon Way, Apt 4B"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Boston"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">State</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="MA"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">Zip Code</label>
                <input
                  type="text"
                  required
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="02108"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Shipping Speed */}
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2 pb-3 border-b border-neutral-100">
              <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center font-bold">3</span>
              Delivery Speed
            </h2>

            <div className="space-y-2">
              <label
                onClick={() => setShippingSpeed('standard')}
                className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  shippingSpeed === 'standard' ? 'border-black bg-neutral-50 ring-1 ring-black' : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingSpeed"
                    checked={shippingSpeed === 'standard'}
                    onChange={() => setShippingSpeed('standard')}
                    className="text-black focus:ring-black"
                  />
                  <div>
                    <p className="text-xs font-bold text-neutral-900">Standard Ground (3-5 Business Days)</p>
                    <p className="text-[11px] text-neutral-500">UPS & FedEx Tracked</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-neutral-900">
                  {standardShipping === 0 ? <strong className="text-emerald-600">FREE</strong> : `$${standardShipping.toFixed(2)}`}
                </span>
              </label>

              <label
                onClick={() => setShippingSpeed('expedited')}
                className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  shippingSpeed === 'expedited' ? 'border-black bg-neutral-50 ring-1 ring-black' : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingSpeed"
                    checked={shippingSpeed === 'expedited'}
                    onChange={() => setShippingSpeed('expedited')}
                    className="text-black focus:ring-black"
                  />
                  <div>
                    <p className="text-xs font-bold text-neutral-900">Expedited 2-Day Air</p>
                    <p className="text-[11px] text-neutral-500">Dispatched priority same-day</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-neutral-900">$14.99</span>
              </label>

              <label
                onClick={() => setShippingSpeed('overnight')}
                className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  shippingSpeed === 'overnight' ? 'border-black bg-neutral-50 ring-1 ring-black' : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingSpeed"
                    checked={shippingSpeed === 'overnight'}
                    onChange={() => setShippingSpeed('overnight')}
                    className="text-black focus:ring-black"
                  />
                  <div>
                    <p className="text-xs font-bold text-neutral-900">Next-Day Priority Overnight</p>
                    <p className="text-[11px] text-neutral-500">Delivered tomorrow before 12 PM</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-neutral-900">$24.99</span>
              </label>
            </div>
          </div>

          {/* Step 4: Payment Method */}
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center font-bold">4</span>
                Payment
              </h2>
              <span className="text-xs text-neutral-500 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                256-Bit Encrypted
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-3 px-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  paymentMethod === 'card' ? 'border-black bg-neutral-50 shadow-sm' : 'border-neutral-200 text-neutral-600'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Credit Card</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('applepay')}
                className={`py-3 px-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  paymentMethod === 'applepay' ? 'border-black bg-neutral-50 shadow-sm' : 'border-neutral-200 text-neutral-600'
                }`}
              >
                <span> Pay</span>
                <span>Apple Pay</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('paypal')}
                className={`py-3 px-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  paymentMethod === 'paypal' ? 'border-black bg-neutral-50 shadow-sm' : 'border-neutral-200 text-neutral-600'
                }`}
              >
                <span className="text-blue-600">PayPal</span>
                <span>Express</span>
              </button>
            </div>

            {paymentMethod === 'card' && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 •••• •••• 4242"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">Expiration</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM / YY"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">CVC / CVV</label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="123"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-black hover:bg-neutral-800 disabled:bg-neutral-300 text-white font-black text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Securing Your Order...</span>
            ) : (
              <span>Place Order · ${finalTotal.toFixed(2)}</span>
            )}
          </button>
        </form>

        {/* Right: Order Summary (5 cols) */}
        <div className="lg:col-span-5 bg-neutral-50 p-6 sm:p-8 rounded-3xl border border-neutral-200 space-y-6">
          <h2 className="text-base font-bold text-neutral-900 pb-3 border-b border-neutral-200">
            Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
          </h2>

          {/* Cart items preview list */}
          <div className="space-y-4 max-h-72 overflow-y-auto divide-y divide-neutral-200/60">
            {items.map((item) => (
              <div key={`${item.productId}-${item.size}-${item.color}`} className="pt-3 flex gap-3 items-center">
                <div className="relative w-16 h-16 bg-white rounded-xl overflow-hidden shrink-0 border border-neutral-200">
                  <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                  <span className="absolute top-0 right-0 bg-neutral-900 text-white text-[10px] font-bold w-5 h-5 rounded-bl-lg flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-neutral-900 truncate">{item.product.name}</p>
                  <p className="text-[11px] text-neutral-500">Size {item.size} · {item.color}</p>
                </div>
                <span className="text-xs font-bold text-neutral-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Promo code input */}
          <div className="pt-3 border-t border-neutral-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Discount code (try STRIDE10)"
                className="flex-1 bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs uppercase placeholder:normal-case focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                className="px-4 py-2 bg-neutral-900 text-white text-xs font-bold rounded-xl hover:bg-black transition-colors"
              >
                Apply
              </button>
            </div>
            {promoSuccess && <p className="text-[11px] text-emerald-600 font-semibold mt-1.5">{promoSuccess}</p>}
            {promoError && <p className="text-[11px] text-red-600 font-semibold mt-1.5">{promoError}</p>}
          </div>

          {/* Totals Breakdown */}
          <div className="space-y-2 text-xs pt-3 border-t border-neutral-200">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span className="font-semibold text-neutral-900">${subtotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount (STRIDE10)</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-neutral-600">
              <span>Shipping</span>
              <span>{shippingCost === 0 ? <strong className="text-emerald-600">FREE</strong> : `$${shippingCost.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Estimated Tax (8%)</span>
              <span>${finalTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-black text-neutral-900 pt-3 border-t border-neutral-200">
              <span>Total</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="pt-2 text-xs text-neutral-500 space-y-1.5">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>30-Day Risk-Free Outdoor Wear Trial</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
              <span>1-Year Manufacturer Defect Warranty</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
