import { useState, useEffect } from 'react';
import { X, Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import type { BottleSizeLabel, Fragrance } from '../types/fragrance.ts';
import { formatCurrency } from '../utils/commerce.ts';
import { LuxuryImage } from './LuxuryImage.tsx';

interface QuickViewModalProps {
  product: Fragrance | null;
  isWishlisted: boolean;
  onClose: () => void;
  onAddToCart: (product: Fragrance, size: BottleSizeLabel) => void;
  onToggleWishlist: (productId: string) => void;
  onViewDetails: (slug: string) => void;
}

export function QuickViewModal({
  product,
  isWishlisted,
  onClose,
  onAddToCart,
  onToggleWishlist,
  onViewDetails,
}: QuickViewModalProps) {
  const [selectedSize, setSelectedSize] = useState<BottleSizeLabel>('50ml');

  useEffect(() => {
    if (product) {
      const preferred =
        product.sizes.find((s) => s.size === '50ml')?.size ?? product.sizes[0].size;
      setSelectedSize(preferred);
    }
  }, [product]);

  if (!product) return null;

  const activeOption =
    product.sizes.find((s) => s.size === selectedSize) ?? product.sizes[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#101010]/70 backdrop-blur-[2px] p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view ${product.name}`}
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-4xl bg-[#F7F4EE] border border-[#101010]/15 shadow-2xl grid grid-cols-1 md:grid-cols-12 overflow-hidden max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute top-3 right-3 z-20 flex h-10 w-10 items-center justify-center bg-white/90 text-[#101010] hover:bg-[#101010] hover:text-[#F7F4EE] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="md:col-span-6 bg-[#E9E1D5] aspect-[4/3] md:aspect-auto md:h-full">
          <LuxuryImage
            src={product.images[0]}
            alt={product.name}
            fallbackTitle={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#C6A66A] font-medium">
              {product.concentration} · {product.primaryFamily}
            </p>
            <h2 className="mt-2 font-serif text-3xl font-medium tracking-[0.04em] text-[#101010]">
              {product.name}
            </h2>
            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[#292929]/70">
              {product.subtitle}
            </p>

            <p className="mt-4 text-xl font-medium tabular-nums text-[#101010]">
              {formatCurrency(activeOption.price)}
            </p>

            <p className="mt-4 text-sm leading-relaxed text-[#292929]/85">
              {product.shortDescription}
            </p>

            <div className="mt-5 pt-4 border-t border-[#101010]/10">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#292929]/70">
                Select Flacon Volume
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {product.sizes.map((opt) => (
                  <button
                    key={opt.size}
                    type="button"
                    onClick={() => setSelectedSize(opt.size)}
                    className={`h-10 px-4 text-xs tracking-[0.14em] uppercase tabular-nums border transition-colors ${
                      selectedSize === opt.size
                        ? 'bg-[#101010] text-[#F7F4EE] border-[#101010]'
                        : 'bg-white text-[#101010] border-[#101010]/20 hover:border-[#101010]'
                    }`}
                  >
                    {opt.size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 text-xs border-t border-[#101010]/10 pt-4">
              <div>
                <span className="block text-[10px] uppercase tracking-[0.14em] text-[#292929]/60">
                  Top
                </span>
                <span className="mt-0.5 block text-[#101010]">
                  {product.notes.top[0]?.name}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-[0.14em] text-[#292929]/60">
                  Heart
                </span>
                <span className="mt-0.5 block text-[#101010]">
                  {product.notes.heart[0]?.name}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-[0.14em] text-[#292929]/60">
                  Base
                </span>
                <span className="mt-0.5 block text-[#101010]">
                  {product.notes.base[0]?.name}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => {
                  onAddToCart(product, selectedSize);
                  onClose();
                }}
                className="flex-1 h-12 bg-[#101010] text-xs font-medium tracking-[0.16em] uppercase text-[#F7F4EE] hover:bg-[#292929] transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" strokeWidth={1.6} />
                <span>Add to Bag · {formatCurrency(activeOption.price)}</span>
              </button>
              <button
                type="button"
                onClick={() => onToggleWishlist(product.id)}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                className={`h-12 w-12 flex items-center justify-center border transition-colors ${
                  isWishlisted
                    ? 'bg-[#101010] text-[#C6A66A] border-[#101010]'
                    : 'bg-white text-[#101010] border-[#101010]/20 hover:border-[#101010]'
                }`}
              >
                <Heart
                  className="w-4 h-4"
                  fill={isWishlisted ? 'currentColor' : 'none'}
                />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onViewDetails(product.slug);
              }}
              className="w-full h-10 text-xs tracking-[0.14em] uppercase text-[#101010] hover:text-[#C6A66A] transition-colors inline-flex items-center justify-center gap-1.5"
            >
              <span>View Full Olfactory Story</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
