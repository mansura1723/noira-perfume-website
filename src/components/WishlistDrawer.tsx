import { X, ShoppingBag, Trash2, Heart } from 'lucide-react';
import type { BottleSizeLabel, Fragrance } from '../types/fragrance.ts';
import { formatCurrency, getStartingPrice } from '../utils/commerce.ts';
import { LuxuryImage } from './LuxuryImage.tsx';

interface WishlistDrawerProps {
  isOpen: boolean;
  products: Fragrance[];
  wishlistIds: string[];
  onClose: () => void;
  onRemoveWishlist: (productId: string) => void;
  onAddToCart: (product: Fragrance, size: BottleSizeLabel) => void;
  onSelectProduct: (slug: string) => void;
}

export function WishlistDrawer({
  isOpen,
  products,
  wishlistIds,
  onClose,
  onRemoveWishlist,
  onAddToCart,
  onSelectProduct,
}: WishlistDrawerProps) {
  if (!isOpen) return null;

  const saved = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#101010]/60 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Saved Wishlist"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <aside className="relative z-10 flex h-full w-full max-w-md flex-col bg-[#F7F4EE] text-[#101010] shadow-2xl border-l border-[#101010]/15">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#101010]/10">
          <div>
            <h2 className="font-serif text-2xl tracking-[0.06em] uppercase">
              Private Wishlist
            </h2>
            <p className="text-xs tracking-[0.12em] uppercase text-[#292929]/70 tabular-nums">
              {saved.length} {saved.length === 1 ? 'Saved Creation' : 'Saved Creations'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close wishlist"
            className="flex h-10 w-10 items-center justify-center text-[#101010] hover:text-[#C6A66A]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {saved.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center py-12">
              <Heart className="w-9 h-9 text-[#C6A66A]" strokeWidth={1.2} />
              <h3 className="mt-4 font-serif text-2xl">No Saved Fragrances</h3>
              <p className="mt-2 max-w-xs text-sm text-[#292929]/75">
                Select the heart icon on any creation to curate your personal olfactory shortlist.
              </p>
            </div>
          ) : (
            <ul className="space-y-5">
              {saved.map((item) => {
                const defaultSize =
                  item.sizes.find((s) => s.size === '50ml')?.size ?? item.sizes[0].size;
                return (
                  <li
                    key={item.id}
                    className="bg-white border border-[#101010]/10 p-4 flex gap-4"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onSelectProduct(item.slug);
                      }}
                      className="w-20 h-20 shrink-0 bg-[#E9E1D5] overflow-hidden"
                    >
                      <LuxuryImage
                        src={item.images[0]}
                        alt={item.name}
                        fallbackTitle={item.name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onSelectProduct(item.slug);
                          }}
                          className="font-serif text-lg text-[#101010] hover:text-[#C6A66A] text-left truncate"
                        >
                          {item.name}
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveWishlist(item.id)}
                          aria-label={`Remove ${item.name} from wishlist`}
                          className="p-1 text-[#292929]/60 hover:text-[#101010]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-[#292929]/70 tabular-nums">
                        From {formatCurrency(getStartingPrice(item))}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          onAddToCart(item, defaultSize);
                          onClose();
                        }}
                        className="mt-3 h-9 px-3 bg-[#101010] text-[11px] font-medium tracking-[0.14em] uppercase text-[#F7F4EE] hover:bg-[#292929] inline-flex items-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add {defaultSize} to Bag</span>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}
