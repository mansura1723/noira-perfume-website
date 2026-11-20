import { useState, useMemo, useEffect } from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import type {
  AppView,
  BottleSizeLabel,
  CatalogFilters,
  CollectionKey,
  Fragrance,
  FragranceCategory,
  FragranceFamily,
  PriceRangeFilter,
  SortOption,
} from '../types/fragrance.ts';
import { COLLECTIONS, OLFACTORY_FAMILIES } from '../data/catalog.ts';
import { filterFragrances, sortFragrances } from '../utils/commerce.ts';
import { LuxuryImage } from './LuxuryImage.tsx';
import { ProductCard } from './ProductCard.tsx';

interface CollectionPageProps {
  products: Fragrance[];
  wishlistIds: string[];
  initialCollection?: CollectionKey;
  initialFamily?: FragranceFamily | 'all';
  initialSearch?: string;
  onNavigate: (view: AppView) => void;
  onQuickView: (product: Fragrance) => void;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Fragrance, size: BottleSizeLabel) => void;
}

export function CollectionPage({
  products,
  wishlistIds,
  initialCollection = 'all',
  initialFamily = 'all',
  initialSearch = '',
  onNavigate,
  onQuickView,
  onToggleWishlist,
  onAddToCart,
}: CollectionPageProps) {
  const [filters, setFilters] = useState<CatalogFilters>({
    collection: initialCollection,
    category: 'all',
    family: initialFamily,
    size: 'all',
    priceRange: 'all',
    searchQuery: initialSearch,
  });
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      collection: initialCollection,
      family: initialFamily,
      searchQuery: initialSearch,
    }));
  }, [initialCollection, initialFamily, initialSearch]);

  const activeCollectionMeta = COLLECTIONS.find(
    (c) => c.key === filters.collection,
  );

  const filteredProducts = useMemo(() => {
    const matched = filterFragrances(products, filters);
    return sortFragrances(matched, sortBy);
  }, [products, filters, sortBy]);

  const resetFilters = () => {
    setFilters({
      collection: 'all',
      category: 'all',
      family: 'all',
      size: 'all',
      priceRange: 'all',
      searchQuery: '',
    });
    setSortBy('featured');
  };

  const hasActiveFilters =
    filters.collection !== 'all' ||
    filters.category !== 'all' ||
    filters.family !== 'all' ||
    filters.size !== 'all' ||
    filters.priceRange !== 'all' ||
    filters.searchQuery.trim() !== '';

  const bannerImage =
    activeCollectionMeta?.image ??
    (filters.collection === 'gifts'
      ? '/src/assets/images/gift_coffret_atelier_1795192807870.jpg'
      : '/src/assets/images/campaign_scent_remains_1795192808469.jpg');

  const bannerTitle =
    activeCollectionMeta?.title ??
    (filters.collection === 'gifts'
      ? 'EXCLUSIVE GIFT COFFRETS'
      : 'THE COMPLETE OLFACTORY ARCHIVE');

  const bannerDesc =
    activeCollectionMeta?.description ??
    (filters.collection === 'gifts'
      ? 'Satin-lined obsidian coffrets paired with complimentary brass monogramming and travel atomizers.'
      : 'Explore every Noira eau de parfum, intense composition, and numbered extrait de parfum.');

  return (
    <main className="bg-[#F7F4EE] min-h-screen">
      {/* Editorial Collection Hero Banner */}
      <section className="relative bg-[#101010] text-[#F7F4EE] py-20 sm:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <LuxuryImage
            src={bannerImage}
            alt={bannerTitle}
            fallbackTitle={bannerTitle}
            darkSurface
            className="w-full h-full object-cover opacity-45"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#101010] via-[#101010]/65 to-[#101010]/40"
            aria-hidden="true"
          />
        </div>
        <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-8">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#C6A66A]">
            Maison Noira · Catalogue
          </p>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-normal tracking-[0.04em] [text-wrap:balance]">
            {bannerTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-[#F7F4EE]/80 leading-relaxed">
            {bannerDesc}
          </p>
        </div>
      </section>

      {/* Filter Toolbar + Grid */}
      <section className="mx-auto max-w-[1440px] px-4 sm:px-8 py-12 sm:py-16">
        {/* Top Control Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#101010]/10">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen((prev) => !prev)}
              className="lg:hidden h-10 px-4 border border-[#101010]/25 bg-white text-xs uppercase tracking-[0.14em] inline-flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>

            <span className="text-xs uppercase tracking-[0.14em] text-[#292929]/75 tabular-nums">
              Showing {filteredProducts.length} of {products.length} Creations
            </span>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-[#C6A66A] hover:text-[#101010] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <label
              htmlFor="catalog-sort-select"
              className="text-xs uppercase tracking-[0.14em] text-[#292929]/70"
            >
              Sort
            </label>
            <select
              id="catalog-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="h-10 px-3 bg-white border border-[#101010]/20 text-xs uppercase tracking-[0.12em] text-[#101010] focus:outline-none focus:border-[#C6A66A]"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Faceted Filter Sidebar */}
          <aside
            className={`lg:col-span-3 space-y-8 ${
              mobileFiltersOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            {/* Search within catalog */}
            <div>
              <label
                htmlFor="catalog-keyword-filter"
                className="block text-[11px] uppercase tracking-[0.16em] text-[#292929]/70 mb-2.5"
              >
                Search Notes or Name
              </label>
              <input
                id="catalog-keyword-filter"
                type="text"
                value={filters.searchQuery}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
                }
                placeholder="e.g. Iris, Oud, Rose..."
                className="w-full h-10 px-3 bg-white border border-[#101010]/20 text-sm text-[#101010] focus:outline-none focus:border-[#C6A66A]"
              />
            </div>

            {/* Collection Filter */}
            <div>
              <h2 className="text-[11px] uppercase tracking-[0.16em] text-[#292929]/70 mb-3">
                Collection
              </h2>
              <div className="space-y-1.5">
                {(
                  [
                    { key: 'all', label: 'All Collections' },
                    { key: 'feminine', label: 'Feminine Collection' },
                    { key: 'masculine', label: 'Masculine Collection' },
                    { key: 'signature', label: 'Signature Collection' },
                    { key: 'exclusive', label: 'Exclusive Extraits' },
                    { key: 'gifts', label: 'Gift Coffrets' },
                  ] as const
                ).map((col) => (
                  <button
                    key={col.key}
                    type="button"
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, collection: col.key }))
                    }
                    className={`w-full py-1.5 text-left text-sm transition-colors ${
                      filters.collection === col.key
                        ? 'font-medium text-[#101010] underline underline-offset-4 decoration-[#C6A66A]'
                        : 'text-[#292929]/75 hover:text-[#101010]'
                    }`}
                  >
                    {col.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender / Category Filter */}
            <div>
              <h2 className="text-[11px] uppercase tracking-[0.16em] text-[#292929]/70 mb-3">
                Audience
              </h2>
              <div className="flex flex-wrap gap-2">
                {(['all', 'For Her', 'For Him', 'Unisex'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        category: cat as 'all' | FragranceCategory,
                      }))
                    }
                    className={`h-9 px-3 text-xs uppercase tracking-[0.12em] border transition-colors ${
                      filters.category === cat
                        ? 'bg-[#101010] text-[#F7F4EE] border-[#101010]'
                        : 'bg-white text-[#101010] border-[#101010]/15 hover:border-[#C6A66A]'
                    }`}
                  >
                    {cat === 'all' ? 'All' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Olfactory Family Filter */}
            <div>
              <h2 className="text-[11px] uppercase tracking-[0.16em] text-[#292929]/70 mb-3">
                Fragrance Family
              </h2>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, family: 'all' }))}
                  className={`h-9 px-3 text-xs uppercase tracking-[0.12em] border transition-colors ${
                    filters.family === 'all'
                      ? 'bg-[#101010] text-[#F7F4EE] border-[#101010]'
                      : 'bg-white text-[#101010] border-[#101010]/15 hover:border-[#C6A66A]'
                  }`}
                >
                  All
                </button>
                {OLFACTORY_FAMILIES.map((f) => (
                  <button
                    key={f.family}
                    type="button"
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, family: f.family }))
                    }
                    className={`h-9 px-3 text-xs uppercase tracking-[0.12em] border transition-colors ${
                      filters.family === f.family
                        ? 'bg-[#101010] text-[#F7F4EE] border-[#101010]'
                        : 'bg-white text-[#101010] border-[#101010]/15 hover:border-[#C6A66A]'
                    }`}
                  >
                    {f.family}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottle Size Filter */}
            <div>
              <h2 className="text-[11px] uppercase tracking-[0.16em] text-[#292929]/70 mb-3">
                Flacon Size
              </h2>
              <div className="flex flex-wrap gap-2">
                {(['all', '30ml', '50ml', '100ml', 'Coffret'] as const).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setFilters((prev) => ({ ...prev, size: sz }))}
                    className={`h-9 px-3 text-xs uppercase tracking-[0.12em] tabular-nums border transition-colors ${
                      filters.size === sz
                        ? 'bg-[#101010] text-[#F7F4EE] border-[#101010]'
                        : 'bg-white text-[#101010] border-[#101010]/15 hover:border-[#C6A66A]'
                    }`}
                  >
                    {sz === 'all' ? 'All Sizes' : sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Tier Filter */}
            <div>
              <h2 className="text-[11px] uppercase tracking-[0.16em] text-[#292929]/70 mb-3">
                Price Tier
              </h2>
              <div className="space-y-1.5">
                {(
                  [
                    { key: 'all', label: 'All Prices' },
                    { key: 'under-220', label: 'Under $220' },
                    { key: '220-300', label: '$220 – $300' },
                    { key: 'over-300', label: 'Over $300' },
                  ] as { key: PriceRangeFilter; label: string }[]
                ).map((tier) => (
                  <button
                    key={tier.key}
                    type="button"
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, priceRange: tier.key }))
                    }
                    className={`w-full py-1.5 text-left text-sm tabular-nums transition-colors ${
                      filters.priceRange === tier.key
                        ? 'font-medium text-[#101010] underline underline-offset-4 decoration-[#C6A66A]'
                        : 'text-[#292929]/75 hover:text-[#101010]'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="bg-white border border-[#101010]/10 p-12 text-center">
                <h2 className="font-serif text-3xl text-[#101010]">
                  No Matching Creations
                </h2>
                <p className="mt-3 text-sm text-[#292929]/75 max-w-md mx-auto">
                  Adjust your olfactory filters or clear your search to view the full Maison Noira collection.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-6 h-11 px-6 bg-[#101010] text-xs uppercase tracking-[0.16em] text-[#F7F4EE] hover:bg-[#292929]"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={wishlistIds.includes(product.id)}
                    onSelectProduct={(slug) => onNavigate({ page: 'product', slug })}
                    onQuickView={onQuickView}
                    onToggleWishlist={onToggleWishlist}
                    onAddToCart={(item, size) => onAddToCart(item, size)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
