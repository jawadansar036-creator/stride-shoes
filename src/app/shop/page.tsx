'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Search } from 'lucide-react';
import { PRODUCTS, ProductItem } from '@/lib/products-data';
import { FilterSidebar, FilterState } from '@/components/filter-sidebar';
import { ProductGrid } from '@/components/product-grid';

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initialize filters from URL params
  const initialCategory = searchParams.get('category') || 'All';
  const initialGender = searchParams.get('gender') || 'All';
  const initialSearch = searchParams.get('search') || '';
  const initialSort = searchParams.get('sort') || 'featured';

  const [filters, setFilters] = useState<FilterState>({
    search: initialSearch,
    category: initialCategory,
    gender: initialGender,
    brand: 'All',
    size: 'All',
    priceRange: 'all',
    minRating: 0,
  });

  const [sort, setSort] = useState<string>(initialSort);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [catalog, setCatalog] = useState<ProductItem[]>(PRODUCTS);

  // Fetch latest products from API (including admin modifications)
  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data?.products && Array.isArray(data.products)) {
          setCatalog(data.products);
        }
      })
      .catch((err) => console.error('Failed to load dynamic catalog:', err));
  }, []);

  // Sync state if URL searchParams change
  useEffect(() => {
    const cat = searchParams.get('category') || 'All';
    const gen = searchParams.get('gender') || 'All';
    const q = searchParams.get('search') || '';
    const s = searchParams.get('sort') || 'featured';
    setFilters((prev) => ({
      ...prev,
      category: cat,
      gender: gen,
      search: q,
    }));
    setSort(s);
  }, [searchParams]);

  const handleFilterChange = (updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'All',
      gender: 'All',
      brand: 'All',
      size: 'All',
      priceRange: 'all',
      minRating: 0,
    });
    router.push('/shop');
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...catalog];

    // Search query
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.features.some((f) => f.toLowerCase().includes(q))
      );
    }

    // Category
    if (filters.category !== 'All') {
      result = result.filter(
        (p) => p.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Gender
    if (filters.gender !== 'All') {
      result = result.filter(
        (p) =>
          p.gender.toLowerCase() === filters.gender.toLowerCase() ||
          p.gender === 'Unisex'
      );
    }

    // Brand
    if (filters.brand !== 'All') {
      result = result.filter((p) => p.brand.toLowerCase() === filters.brand.toLowerCase());
    }

    // Size
    if (filters.size !== 'All') {
      result = result.filter((p) => p.sizes.includes(filters.size));
    }

    // Price Range
    if (filters.priceRange !== 'all') {
      const [minStr, maxStr] = filters.priceRange.split('-');
      const min = parseFloat(minStr);
      const max = parseFloat(maxStr);
      result = result.filter((p) => p.price >= min && p.price <= max);
    }

    // Rating
    if (filters.minRating > 0) {
      result = result.filter((p) => p.rating >= filters.minRating);
    }

    // Sorting
    if (sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'newest') {
      result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    } else if (sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      // featured
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [filters, sort]);

  // Active filters list for chips
  const activeChips = useMemo(() => {
    const chips: Array<{ label: string; clear: () => void }> = [];
    if (filters.search) {
      chips.push({
        label: `"${filters.search}"`,
        clear: () => handleFilterChange({ search: '' }),
      });
    }
    if (filters.category !== 'All') {
      chips.push({
        label: `Category: ${filters.category}`,
        clear: () => handleFilterChange({ category: 'All' }),
      });
    }
    if (filters.gender !== 'All') {
      chips.push({
        label: `Gender: ${filters.gender}`,
        clear: () => handleFilterChange({ gender: 'All' }),
      });
    }
    if (filters.brand !== 'All') {
      chips.push({
        label: `Brand: ${filters.brand}`,
        clear: () => handleFilterChange({ brand: 'All' }),
      });
    }
    if (filters.size !== 'All') {
      chips.push({
        label: `Size: ${filters.size}`,
        clear: () => handleFilterChange({ size: 'All' }),
      });
    }
    if (filters.priceRange !== 'all') {
      chips.push({
        label: `Price: $${filters.priceRange.replace('-', ' - $')}`,
        clear: () => handleFilterChange({ priceRange: 'all' }),
      });
    }
    if (filters.minRating > 0) {
      chips.push({
        label: `Rating: ${filters.minRating}+ ★`,
        clear: () => handleFilterChange({ minRating: 0 }),
      });
    }
    return chips;
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Title & Breadcrumb */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium mb-1">
          <span>Home</span>
          <span>/</span>
          <span className="text-neutral-900 font-semibold">Shop Footwear</span>
          {filters.category !== 'All' && (
            <>
              <span>/</span>
              <span className="text-accent font-semibold">{filters.category}</span>
            </>
          )}
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-neutral-900">
          All Footwear Collection
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Explore {catalog.length} premium models with nitrogen supercritical foams, carbon plates, and fine Italian leathers.
        </p>
      </div>

      {/* Control Bar: Search input, Mobile Filter trigger, and Sort dropdown */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-6 border-b border-neutral-200">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange({ search: e.target.value })}
            placeholder="Search by shoe name, features, or materials..."
            className="w-full bg-neutral-100 border-none rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black text-neutral-900"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
          {filters.search && (
            <button
              onClick={() => handleFilterChange({ search: '' })}
              className="absolute right-3 top-3 text-neutral-400 hover:text-black"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-xl text-xs font-bold transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters {activeChips.length > 0 && `(${activeChips.length})`}</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500 font-semibold hidden sm:inline">Sort By:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest Drops</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 py-4">
          <span className="text-xs text-neutral-400 font-medium">Active Filters:</span>
          {activeChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={chip.clear}
              className="flex items-center gap-1.5 px-3 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-full transition-colors group"
            >
              <span>{chip.label}</span>
              <X className="w-3 h-3 text-neutral-400 group-hover:text-black" />
            </button>
          ))}
          <button
            onClick={handleResetFilters}
            className="text-xs text-accent hover:underline font-bold ml-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Content Layout: Sidebar + Grid */}
      <div className="flex pt-6 items-start">
        {/* Desktop Sidebar & Mobile Sheet */}
        <FilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          isOpenMobile={mobileFilterOpen}
          onCloseMobile={() => setMobileFilterOpen(false)}
          totalResults={filteredProducts.length}
        />

        {/* Product Grid Area */}
        <div className="flex-1 w-full">
          <ProductGrid
            products={filteredProducts}
            onResetFilters={handleResetFilters}
          />
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16 text-center text-neutral-400">Loading collection...</div>}>
      <ShopContent />
    </Suspense>
  );
}
