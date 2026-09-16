'use client';

import React, { useState } from 'react';
import { ProductItem } from '@/lib/products-data';
import { ProductCard } from './product-card';
import { QuickViewModal } from './quick-view-modal';
import { SearchX, RotateCcw } from 'lucide-react';

interface ProductGridProps {
  products: ProductItem[];
  loading?: boolean;
  onResetFilters?: () => void;
}

export function ProductGrid({ products, loading = false, onResetFilters }: ProductGridProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<ProductItem | null>(null);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-neutral-100 rounded-2xl aspect-[3/4] animate-pulse" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-neutral-50 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4 border border-dashed border-neutral-200">
        <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center text-neutral-500">
          <SearchX className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-neutral-900">No matching shoes found</h3>
          <p className="text-xs text-neutral-500 max-w-sm mt-1">
            Try adjusting your filters, selecting a different size or category, or resetting all filters.
          </p>
        </div>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-xl hover:bg-black transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        ))}
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
}
