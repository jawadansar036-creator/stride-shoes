import { NextRequest, NextResponse } from 'next/server';
import { PRODUCTS, ProductItem } from '@/lib/products-data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search')?.toLowerCase();
  const category = searchParams.get('category');
  const gender = searchParams.get('gender');
  const brand = searchParams.get('brand');
  const size = searchParams.get('size');
  const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
  const minRating = searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined;
  const sort = searchParams.get('sort') || 'featured';

  let filtered: ProductItem[] = [...PRODUCTS];

  if (search) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.brand.toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        p.features.some((f) => f.toLowerCase().includes(search))
    );
  }

  if (category && category !== 'All') {
    filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  if (gender && gender !== 'All') {
    filtered = filtered.filter(
      (p) => p.gender.toLowerCase() === gender.toLowerCase() || p.gender === 'Unisex'
    );
  }

  if (brand && brand !== 'All') {
    filtered = filtered.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
  }

  if (size && size !== 'All') {
    filtered = filtered.filter((p) => p.sizes.includes(size));
  }

  if (minPrice !== undefined) {
    filtered = filtered.filter((p) => p.price >= minPrice);
  }

  if (maxPrice !== undefined) {
    filtered = filtered.filter((p) => p.price <= maxPrice);
  }

  if (minRating !== undefined) {
    filtered = filtered.filter((p) => p.rating >= minRating);
  }

  // Sort
  if (sort === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === 'newest') {
    filtered.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
  } else if (sort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else {
    // Featured
    filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }

  return NextResponse.json({
    products: filtered,
    total: filtered.length,
  });
}
