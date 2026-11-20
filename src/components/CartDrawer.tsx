import { Minus, Plus, Trash2, X, ArrowRight, ShoppingBag } from 'lucide-react';
import type { CartItem } from '../types/fragrance.ts';
import {
  calculateCartTotals,
  COMPLIMENTARY_SHIPPING_THRESHOLD,
  formatCurrency,
} from '../utils/commerce.ts';
import { LuxuryImage } from './LuxuryImage.tsx';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (key: string, delta: number) => void;
  onRemoveItem: (key: string) => void;
  onCheckout: () => void;
  onExploreFragrances: () => void;
}

export function CartDrawer({
  isOpen,
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onExploreFragrances,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const totals = calculateCartTotals(items);
  const progressPct = Math.min(
    100,
    Math.round((totals.subtotal / COMPLIMENTARY_SHIPPING_THRESHOLD) * 100),
  );

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#101010]/60 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <aside className="relative z-10 flex h-full w-full max-w-md flex-col bg-[#F7F4EE] text-[#101010] shadow-2xl border-l border-[#101010]/15">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#101010]/10">
          <div>
            <h2 className="font-serif text-2xl tracking-[0.06em] uppercase">
              Shopping Bag
            </h2>
            <p className="text-xs tracking-[0.12em] uppercase text-[#292929]/70 tabular-nums">
              {totals.itemCount} {totals.itemCount === 1 ? 'Creation' : 'Creations'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close shopping bag"
            className="flex h-10 w-10 items-center justify-center text-[#101010] hover:text-[#C6A66A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Complimentary Express Shipping Threshold Bar */}
        <div className="px-6 py-3.5 bg-[#E9E1D5]/60 border-b border-[#101010]/10">
          <p className="text-xs tracking-[0.08em] text-[#101010]">
            {totals.remainingForFreeShipping > 0 ? (
              <>
                Add{' '}
                <span className="font-semibold tabular-nums">
                  {formatCurrency(totals.remainingForFreeShipping)}
                </span>{' '}
                more for complimentary express courier delivery.
              </>
            ) : (
              <span>
                Your order qualifies for complimentary Parisian express courier delivery.
              </span>
            )}
          </p>
          <div className="mt-2 h-1 w-full bg-[#101010]/10 overflow-hidden">
            <div
              className="h-full bg-[#C6A66A] transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center py-12">
              <ShoppingBag className="w-10 h-10 text-[#C6A66A]" strokeWidth={1.2} />
              <h3 className="mt-4 font-serif text-2xl text-[#101010]">
                Your Bag is Empty
              </h3>
              <p className="mt-2 max-w-xs text-sm text-[#292929]/75">
                Explore our extraits de parfum and signature collections to compose your olfactory wardrobe.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onExploreFragrances();
                }}
                className="mt-6 px-6 py-3 bg-[#101010] text-xs font-medium tracking-[0.16em] uppercase text-[#F7F4EE] hover:bg-[#292929] transition-colors"
              >
                Explore Fragrances
              </button>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => (
                <li
                  key={item.key}
                  className="flex gap-4 pb-6 border-b border-[#101010]/10 last:border-b-0"
                >
                  <div className="w-24 h-24 shrink-0 bg-[#E9E1D5] border border-[#101010]/10 overflow-hidden">
                    <LuxuryImage
                      src={item.image}
                      alt={item.name}
                      fallbackTitle={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-serif text-lg text-[#101010] truncate">
                          {item.name}
                        </p>
                        <p className="text-xs tracking-[0.1em] uppercase text-[#292929]/70 tabular-nums">
                          {item.size} · {item.concentration}
                        </p>
                        {item.engraving && (
                          <p className="mt-1 text-[11px] tracking-[0.12em] uppercase text-[#C6A66A]">
                            Engraving: {item.engraving}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.key)}
                        aria-label={`Remove ${item.name} ${item.size}`}
                        className="p-1.5 text-[#292929]/60 hover:text-[#101010] transition-colors"
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={1.6} />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center border border-[#101010]/20 bg-white">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.key, -1)}
                          aria-label={`Decrease quantity for ${item.name}`}
                          className="h-8 w-8 flex items-center justify-center text-[#101010] hover:bg-[#F7F4EE]"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-medium tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.key, 1)}
                          aria-label={`Increase quantity for ${item.name}`}
                          className="h-8 w-8 flex items-center justify-center text-[#101010] hover:bg-[#F7F4EE]"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-sm font-medium tabular-nums text-[#101010]">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-[#101010]/15 bg-white px-6 py-5 space-y-4">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-[#292929]/80">
                <span>Subtotal</span>
                <span className="tabular-nums font-medium text-[#101010]">
                  {formatCurrency(totals.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-[#292929]/80">
                <span>Courier Delivery</span>
                <span className="tabular-nums">
                  {totals.shipping === 0 ? 'Complimentary' : formatCurrency(totals.shipping)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#101010]/10 font-medium text-[#101010]">
                <span>Estimated Total</span>
                <span className="tabular-nums text-base">
                  {formatCurrency(totals.subtotal + totals.shipping)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onCheckout}
              data-testid="proceed-to-checkout"
              className="w-full h-12 bg-[#101010] text-xs font-medium tracking-[0.18em] uppercase text-[#F7F4EE] hover:bg-[#292929] transition-colors flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
