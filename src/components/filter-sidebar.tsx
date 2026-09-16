'use client';

import React from 'react';
import { X, RotateCcw, Check } from 'lucide-react';

export interface FilterState {
  search: string;
  category: string;
  gender: string;
  brand: string;
  size: string;
  priceRange: string;
  minRating: number;
}

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onReset: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  totalResults: number;
}

const CATEGORIES = ['All', 'Running', 'Lifestyle', 'Trail', 'Basketball', 'Training', 'Luxury'];
const GENDERS = ['All', 'Men', 'Women', 'Kids'];
const BRANDS = ['All', 'Stride', 'Velo Studio', 'Apex Outdoor', 'Volt Athletic', 'Aura Luxe'];
const SIZES = ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13'];
const PRICE_PRESETS = [
  { label: 'All Prices', value: 'all' },
  { label: 'Under $100', value: '0-100' },
  { label: '$100 – $150', value: '100-150' },
  { label: '$150 – $200', value: '150-200' },
  { label: '$200 & Above', value: '200-999' },
];

export function FilterSidebar({
  filters,
  onFilterChange,
  onReset,
  isOpenMobile = false,
  onCloseMobile,
  totalResults,
}: FilterSidebarProps) {
  const activeFilterCount = [
    filters.category !== 'All',
    filters.gender !== 'All',
    filters.brand !== 'All',
    filters.size !== 'All',
    filters.priceRange !== 'all',
    filters.minRating > 0,
    Boolean(filters.search),
  ].filter(Boolean).length;

  const content = (
    <div className="space-y-6 text-sm">
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
        <div>
          <h3 className="font-bold text-neutral-900 text-base">Filters</h3>
          <p className="text-xs text-neutral-500">{totalResults} {totalResults === 1 ? 'shoe' : 'shoes'} available</p>
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-neutral-600 hover:text-black font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset ({activeFilterCount})</span>
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">Category</label>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat;
            return (
              <button
                key={cat}
                onClick={() => onFilterChange({ category: cat })}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Gender Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">Gender</label>
        <div className="grid grid-cols-2 gap-1.5">
          {GENDERS.map((g) => {
            const isSelected = filters.gender === g;
            return (
              <button
                key={g}
                onClick={() => onFilterChange({ gender: g })}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border text-center transition-all ${
                  isSelected
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'border-neutral-200 text-neutral-700 hover:border-neutral-400 bg-white'
                }`}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">Price Range</label>
        <div className="space-y-1">
          {PRICE_PRESETS.map((p) => {
            const isSelected = filters.priceRange === p.value;
            return (
              <label
                key={p.value}
                className="flex items-center gap-2.5 text-xs text-neutral-700 cursor-pointer hover:text-black py-1"
              >
                <input
                  type="radio"
                  name="priceRange"
                  checked={isSelected}
                  onChange={() => onFilterChange({ priceRange: p.value })}
                  className="rounded-full text-black focus:ring-black h-4 w-4"
                />
                <span>{p.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Size Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">US Size</label>
        <div className="grid grid-cols-4 gap-1.5">
          {SIZES.map((sz) => {
            const isSelected = filters.size === sz;
            return (
              <button
                key={sz}
                onClick={() => onFilterChange({ size: isSelected ? 'All' : sz })}
                className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'border-neutral-200 text-neutral-700 hover:border-neutral-400 bg-white'
                }`}
              >
                {sz}
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">Brand</label>
        <select
          value={filters.brand}
          onChange={(e) => onFilterChange({ brand: e.target.value })}
          className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium text-neutral-800 focus:outline-none focus:ring-2 focus:ring-black"
        >
          {BRANDS.map((b) => (
            <option key={b} value={b}>
              {b === 'All' ? 'All Brands' : b}
            </option>
          ))}
        </select>
      </div>

      {/* Minimum Rating */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">Customer Rating</label>
        <div className="flex gap-2">
          {[0, 4.7, 4.8].map((rate) => (
            <button
              key={rate}
              onClick={() => onFilterChange({ minRating: rate })}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                filters.minRating === rate
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'border-neutral-200 text-neutral-700 hover:border-neutral-300'
              }`}
            >
              {rate === 0 ? 'Any' : `★ ${rate}+`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 pr-6">
        <div className="sticky top-24 bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
          {content}
        </div>
      </aside>

      {/* Mobile Drawer / Sheet */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={onCloseMobile}
          />
          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-slide-up">
            <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-900">Filter Products</h3>
              <button
                onClick={onCloseMobile}
                className="p-1 text-neutral-500 hover:text-black rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1">
              {content}
            </div>

            <div className="p-4 border-t border-neutral-200 bg-neutral-50">
              <button
                onClick={onCloseMobile}
                className="w-full py-3 bg-black text-white font-bold text-xs rounded-xl shadow hover:bg-neutral-800 transition-colors"
              >
                View {totalResults} {totalResults === 1 ? 'Shoe' : 'Shoes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
