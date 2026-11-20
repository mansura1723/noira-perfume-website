import { useState, useMemo } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import type { Fragrance } from '../types/fragrance.ts';
import { filterFragrances, formatCurrency, getStartingPrice } from '../utils/commerce.ts';
import { LuxuryImage } from './LuxuryImage.tsx';

interface SearchOverlayProps {
  isOpen: boolean;
  products: Fragrance[];
  onClose: () => void;
  onSelectProduct: (slug: string) => void;
  onExploreSearch: (query: string) => void;
}

const SUGGESTED_NOTES = ['Oud', 'Iris', 'Rose', 'Bergamot', 'Amber', 'Vanilla', 'Sandalwood'];

export function SearchOverlay({
  isOpen,
  products,
  onClose,
  onSelectProduct,
  onExploreSearch,
}: SearchOverlayProps) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return products.slice(0, 4);
    return filterFragrances(products, {
      collection: 'all',
      category: 'all',
      family: 'all',
      size: 'all',
      priceRange: 'all',
      searchQuery: query,
    }).slice(0, 6);
  }, [products, query]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#101010]/70 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Search Maison Noira"
    >
      <div className="bg-[#F7F4EE] border-b border-[#101010]/15 shadow-2xl">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 py-8">
          <div className="flex items-center justify-between gap-4 border-b border-[#101010]/20 pb-4">
            <div className="flex items-center gap-3 flex-1">
              <Search className="w-5 h-5 text-[#C6A66A] shrink-0" strokeWidth={1.6} />
              <label htmlFor="noira-search-input" className="sr-only">
                Search fragrances, notes, or collections
              </label>
              <input
                id="noira-search-input"
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && query.trim()) {
                    onClose();
                    onExploreSearch(query.trim());
                  }
                }}
                placeholder="Search by creation, note (e.g. Iris, Oud, Rose), or mood..."
                className="w-full bg-transparent text-lg sm:text-xl font-serif text-[#101010] placeholder:text-[#292929]/45 focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close search"
              className="flex h-10 w-10 items-center justify-center text-[#101010] hover:text-[#C6A66A]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Curated Note Prompts */}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
            <span className="uppercase tracking-[0.14em] text-[#292929]/60">
              Popular Notes:
            </span>
            {SUGGESTED_NOTES.map((note) => (
              <button
                key={note}
                type="button"
                onClick={() => setQuery(note)}
                className="px-2.5 py-1 border border-[#101010]/15 bg-white text-[#101010] hover:border-[#C6A66A] transition-colors"
              >
                {note}
              </button>
            ))}
          </div>

          {/* Search Matches */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#292929]/70">
                {query.trim()
                  ? `Matching Creations (${results.length})`
                  : 'Curated Highlights'}
              </p>
              {query.trim() && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onExploreSearch(query.trim());
                  }}
                  className="text-xs uppercase tracking-[0.14em] text-[#101010] hover:text-[#C6A66A] inline-flex items-center gap-1"
                >
                  <span>View in Catalogue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {results.length === 0 ? (
              <p className="py-8 text-sm text-[#292929]/75">
                No fragrance matches "{query}". Try searching by note such as "Rose", "Oud", or "Bergamot".
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {results.slice(0, 4).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onClose();
                      onSelectProduct(item.slug);
                    }}
                    className="group flex items-center gap-4 bg-white border border-[#101010]/10 p-3 text-left hover:border-[#C6A66A] transition-colors"
                  >
                    <div className="w-20 h-20 shrink-0 bg-[#E9E1D5] overflow-hidden">
                      <LuxuryImage
                        src={item.images[0]}
                        alt={item.name}
                        fallbackTitle={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.14em] text-[#292929]/65 truncate">
                        {item.primaryFamily} · {item.concentration}
                      </p>
                      <p className="mt-1 font-serif text-lg text-[#101010] truncate">
                        {item.name}
                      </p>
                      <p className="mt-1 text-xs font-medium tabular-nums text-[#292929]">
                        From {formatCurrency(getStartingPrice(item))}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="h-full" onClick={onClose} aria-hidden="true" />
    </div>
  );
}
