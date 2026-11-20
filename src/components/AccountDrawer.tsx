import { X, Package, Sparkles } from 'lucide-react';
import type { OrderRecord } from '../types/fragrance.ts';
import { formatCurrency } from '../utils/commerce.ts';

interface AccountDrawerProps {
  isOpen: boolean;
  orders: OrderRecord[];
  onClose: () => void;
  onViewOrder: (orderId: string) => void;
  onOpenAtelier: () => void;
}

export function AccountDrawer({
  isOpen,
  orders,
  onClose,
  onViewOrder,
  onOpenAtelier,
}: AccountDrawerProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#101010]/60 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Maison Account and Orders"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <aside className="relative z-10 flex h-full w-full max-w-md flex-col bg-[#F7F4EE] text-[#101010] shadow-2xl border-l border-[#101010]/15">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#101010]/10">
          <div>
            <h2 className="font-serif text-2xl tracking-[0.06em] uppercase">
              Maison Clientèle
            </h2>
            <p className="text-xs tracking-[0.12em] uppercase text-[#C6A66A]">
              Private Order Archive
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close account drawer"
            className="flex h-10 w-10 items-center justify-center text-[#101010] hover:text-[#C6A66A]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <div className="bg-[#101010] text-[#F7F4EE] p-5 border border-[#C6A66A]/30">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#C6A66A]">
              Private Consultation
            </p>
            <h3 className="mt-1.5 font-serif text-2xl">
              Atelier Sur Mesure
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#F7F4EE]/75">
              Request a tailored olfactory layering architecture or commission bespoke flacon imagery inside our private studio.
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAtelier();
              }}
              className="mt-4 h-10 px-4 bg-[#C6A66A] text-[#101010] text-xs font-medium tracking-[0.14em] uppercase hover:bg-[#F7F4EE] transition-colors inline-flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Enter Atelier</span>
            </button>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.16em] text-[#292929]/70 mb-4">
              Recent Orders ({orders.length})
            </h3>
            {orders.length === 0 ? (
              <div className="py-10 text-center bg-white border border-[#101010]/10 p-6">
                <Package className="w-8 h-8 mx-auto text-[#C6A66A]" strokeWidth={1.3} />
                <p className="mt-3 text-sm text-[#292929]/75">
                  No orders recorded in this session yet.
                </p>
              </div>
            ) : (
              <ul className="space-y-4">
                {orders.map((order) => (
                  <li
                    key={order.id}
                    className="bg-white border border-[#101010]/10 p-4 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-lg text-[#101010] tabular-nums">
                        Order {order.id}
                      </span>
                      <span className="text-[11px] uppercase tracking-[0.14em] text-[#C6A66A]">
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#292929]/70 tabular-nums">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      · {order.items.reduce((s, i) => s + i.quantity, 0)} items ·{' '}
                      {formatCurrency(order.total)}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onViewOrder(order.id);
                      }}
                      className="text-xs uppercase tracking-[0.14em] text-[#101010] underline underline-offset-4 decoration-[#C6A66A] hover:text-[#C6A66A]"
                    >
                      View Receipt
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
