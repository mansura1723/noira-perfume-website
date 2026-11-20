import { Heart, Eye, ShoppingBag } from 'lucide-react';
import type { BottleSizeLabel, Fragrance } from '../types/fragrance.ts';
import { formatCurrency } from '../utils/commerce.ts';
import { LuxuryImage } from './LuxuryImage.tsx';

interface ProductCardProps {
  product: Fragrance;
  isWishlisted: boolean;
  onSelectProduct: (slug: string) => void;
  onQuickView: (product: Fragrance) => void;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Fragrance, size: BottleSizeLabel) => void;
}

export function ProductCard({
  product,
  isWishlisted,
  onSelectProduct,
  onQuickView,
  onToggleWishlist,
  onAddToCart,
}: ProductCardProps) {
  const defaultOption =
    product.sizes.find((s) => s.size === '50ml') ?? product.sizes[0];
  const secondaryImage = product.images[1] ?? product.images[0];

  return (
    <article
      className="group flex flex-col bg-white border border-[#101010]/10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-20px_rgba(16,16,16,0.22)]"
      data-testid={`product-card-${product.slug}`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#E9E1D5]">
        <button
          type="button"
          onClick={() => onSelectProduct(product.slug)}
          className="block w-full h-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A66A]"
          aria-label={`View ${product.name}`}
        >
          <LuxuryImage
            src={product.images[0]}
            alt={`${product.name} luxury perfume flacon`}
            fallbackTitle={product.name}
            className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
          />
          <LuxuryImage
            src={secondaryImage}
            alt={`${product.name} editorial presentation`}
            fallbackTitle={product.name}
            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-[1.03]"
          />
        </button>

        {/* Quiet unboxed editorial label (max 1) */}
        {product.badge && (
          <span className="pointer-events-none absolute top-3 left-3 bg-[#101010]/85 px-2.5 py-1 text-[11px] font-medium tracking-[0.16em] uppercase text-[#F7F4EE]">
            {product.badge}
          </span>
        )}

        {/* Top-right functional actions */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onQuickView(product)}
            aria-label={`Quick view ${product.name}`}
            className="flex h-10 w-10 items-center justify-center bg-white/92 text-[#101010] border border-[#101010]/10 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200 hover:bg-[#101010] hover:text-[#F7F4EE] focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A66A]"
          >
            <Eye className="w-4 h-4" strokeWidth={1.6} />
          </button>
          <button
            type="button"
            onClick={() => onToggleWishlist(product.id)}
            aria-label={
              isWishlisted
                ? `Remove ${product.name} from wishlist`
                : `Add ${product.name} to wishlist`
            }
            aria-pressed={isWishlisted}
            className={`flex h-10 w-10 items-center justify-center border border-[#101010]/10 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A66A] ${
              isWishlisted
                ? 'bg-[#101010] text-[#C6A66A]'
                : 'bg-white/92 text-[#101010] hover:bg-[#101010] hover:text-[#F7F4EE]'
            }`}
          >
            <Heart
              className="w-4 h-4"
              strokeWidth={1.6}
              fill={isWishlisted ? 'currentColor' : 'none'}
            />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div>
          <div className="flex items-center justify-between gap-2 text-[11px] uppercase tracking-[0.14em] text-[#292929]/70">
            <span className="truncate">
              {product.primaryFamily} · {product.category}
            </span>
            <span className="tabular-nums shrink-0 text-[#101010]/80">
              ★ {product.rating.toFixed(1)}
            </span>
          </div>

          <h3 className="mt-2 font-serif text-xl font-medium tracking-[0.04em] text-[#101010]">
            <button
              type="button"
              onClick={() => onSelectProduct(product.slug)}
              className="text-left hover:text-[#C6A66A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A66A]"
            >
              {product.name}
            </button>
          </h3>

          <p className="mt-1.5 text-sm leading-relaxed text-[#292929]/80 line-clamp-2">
            {product.shortDescription}
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-[#101010]/10">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[15px] font-medium tabular-nums text-[#101010]">
              {formatCurrency(defaultOption.price)}
            </span>
            <span className="text-xs tracking-[0.08em] text-[#292929]/65 tabular-nums">
              {product.sizes.map((s) => s.size).join(' · ')}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => onQuickView(product)}
              className="h-10 px-3 border border-[#101010]/25 text-xs font-medium tracking-[0.14em] uppercase text-[#101010] hover:border-[#101010] hover:bg-[#F7F4EE] transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A66A]"
            >
              Quick View
            </button>
            <button
              type="button"
              onClick={() => onAddToCart(product, defaultOption.size)}
              className="h-10 px-3 bg-[#101010] text-xs font-medium tracking-[0.14em] uppercase text-[#F7F4EE] hover:bg-[#292929] transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A66A]"
            >
              <ShoppingBag className="w-3.5 h-3.5" strokeWidth={1.6} />
              <span>Add to Bag</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
