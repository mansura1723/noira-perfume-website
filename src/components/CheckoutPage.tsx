import { useState, type FormEvent } from 'react';
import { ArrowLeft, CheckCircle2, Lock } from 'lucide-react';
import type {
  AppView,
  CartItem,
  CheckoutCustomer,
  OrderRecord,
} from '../types/fragrance.ts';
import {
  calculateCartTotals,
  formatCurrency,
  validateCheckoutForm,
} from '../utils/commerce.ts';
import { LuxuryImage } from './LuxuryImage.tsx';

interface CheckoutPageProps {
  items: CartItem[];
  onNavigate: (view: AppView) => void;
  onPlaceOrder: (
    customer: CheckoutCustomer,
  ) => Promise<{ ok: boolean; order?: OrderRecord; error?: string; fields?: Record<string, string> }>;
}

export function CheckoutPage({
  items,
  onNavigate,
  onPlaceOrder,
}: CheckoutPageProps) {
  const [customer, setCustomer] = useState<CheckoutCustomer>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    postalCode: '',
    country: 'France',
    giftMessage: '',
    deliveryMethod: 'complimentary-courier',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const totals = calculateCartTotals(items, customer.deliveryMethod);

  if (items.length === 0) {
    return (
      <main className="bg-[#F7F4EE] min-h-[70vh] flex items-center justify-center px-4 py-20">
        <div className="max-w-md text-center bg-white border border-[#101010]/10 p-10">
          <h1 className="font-serif text-3xl text-[#101010]">
            Your Shopping Bag is Empty
          </h1>
          <p className="mt-3 text-sm text-[#292929]/75">
            Select a fragrance creation before proceeding to concierge checkout.
          </p>
          <button
            type="button"
            onClick={() => onNavigate({ page: 'collections', initialCollection: 'all' })}
            className="mt-6 h-11 px-7 bg-[#101010] text-xs uppercase tracking-[0.16em] text-[#F7F4EE]"
          >
            Browse Fragrances
          </button>
        </div>
      </main>
    );
  }

  const updateField = <K extends keyof CheckoutCustomer>(
    key: K,
    value: CheckoutCustomer[K],
  ) => {
    setCustomer((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errors = validateCheckoutForm(customer);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setSubmitError('Please review the highlighted fields before placing your order.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    const result = await onPlaceOrder(customer);
    setSubmitting(false);

    if (!result.ok || !result.order) {
      if (result.fields) setFieldErrors(result.fields);
      setSubmitError(result.error ?? 'Unable to complete order.');
      return;
    }

    onNavigate({ page: 'confirmation', orderId: result.order.id });
  };

  return (
    <main className="bg-[#F7F4EE] py-12 sm:py-16 min-h-screen">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <button
          type="button"
          onClick={() => onNavigate({ page: 'collections', initialCollection: 'all' })}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#292929]/75 hover:text-[#101010]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </button>

        <div className="mt-6 pb-6 border-b border-[#101010]/10">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#C6A66A]">
            Maison Noira Concierge
          </p>
          <h1 className="mt-2 font-serif text-4xl text-[#101010]">
            Private Checkout
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
        >
          {/* Left Column: Customer & Delivery Details */}
          <div className="lg:col-span-7 space-y-8">
            {submitError && (
              <div
                role="alert"
                className="p-4 bg-rose-50 border border-rose-300 text-sm text-rose-900"
              >
                {submitError}
              </div>
            )}

            <section className="bg-white border border-[#101010]/10 p-6 sm:p-8 space-y-5">
              <h2 className="font-serif text-2xl text-[#101010]">
                01. Client Coordinates
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="chk-first-name"
                    className="block text-[11px] uppercase tracking-[0.14em] text-[#292929]/75 mb-1.5"
                  >
                    First Name *
                  </label>
                  <input
                    id="chk-first-name"
                    type="text"
                    value={customer.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    className="w-full h-11 px-3.5 bg-[#F7F4EE]/40 border border-[#101010]/20 text-sm focus:outline-none focus:border-[#C6A66A]"
                  />
                  {fieldErrors.firstName && (
                    <p className="mt-1 text-xs text-rose-700">{fieldErrors.firstName}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="chk-last-name"
                    className="block text-[11px] uppercase tracking-[0.14em] text-[#292929]/75 mb-1.5"
                  >
                    Last Name *
                  </label>
                  <input
                    id="chk-last-name"
                    type="text"
                    value={customer.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    className="w-full h-11 px-3.5 bg-[#F7F4EE]/40 border border-[#101010]/20 text-sm focus:outline-none focus:border-[#C6A66A]"
                  />
                  {fieldErrors.lastName && (
                    <p className="mt-1 text-xs text-rose-700">{fieldErrors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="chk-email"
                    className="block text-[11px] uppercase tracking-[0.14em] text-[#292929]/75 mb-1.5"
                  >
                    Email Address *
                  </label>
                  <input
                    id="chk-email"
                    type="email"
                    value={customer.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="w-full h-11 px-3.5 bg-[#F7F4EE]/40 border border-[#101010]/20 text-sm focus:outline-none focus:border-[#C6A66A]"
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-xs text-rose-700">{fieldErrors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="chk-phone"
                    className="block text-[11px] uppercase tracking-[0.14em] text-[#292929]/75 mb-1.5"
                  >
                    Telephone (Courier Notification) *
                  </label>
                  <input
                    id="chk-phone"
                    type="tel"
                    value={customer.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="+33 1 42 68 55 00"
                    className="w-full h-11 px-3.5 bg-[#F7F4EE]/40 border border-[#101010]/20 text-sm focus:outline-none focus:border-[#C6A66A]"
                  />
                  {fieldErrors.phone && (
                    <p className="mt-1 text-xs text-rose-700">{fieldErrors.phone}</p>
                  )}
                </div>
              </div>
            </section>

            <section className="bg-white border border-[#101010]/10 p-6 sm:p-8 space-y-5">
              <h2 className="font-serif text-2xl text-[#101010]">
                02. Fulfillment &amp; Settlement Method
              </h2>
              <div className="space-y-3">
                {(
                  [
                    {
                      id: 'complimentary-courier',
                      title: 'Express Courier · Pay on Delivery or Invoice',
                      desc: 'Tracked climate-controlled Parisian dispatch. Complimentary over $250.',
                    },
                    {
                      id: 'cash-on-delivery',
                      title: 'Private Courier · Cash on Delivery (COD)',
                      desc: 'Direct hand-off settlement upon parcel inspection at your residence.',
                    },
                    {
                      id: 'boutique-collection',
                      title: 'Reserve & Collect · 24 Place Vendôme, Paris',
                      desc: 'Prepared within 2 hours with complimentary salon fragrance profiling.',
                    },
                  ] as const
                ).map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${
                      customer.deliveryMethod === method.id
                        ? 'border-[#101010] bg-[#F7F4EE]/60'
                        : 'border-[#101010]/15 hover:border-[#C6A66A]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryMethod"
                      checked={customer.deliveryMethod === method.id}
                      onChange={() => updateField('deliveryMethod', method.id)}
                      className="mt-1 accent-[#101010]"
                    />
                    <div>
                      <span className="block text-sm font-medium text-[#101010]">
                        {method.title}
                      </span>
                      <span className="block mt-0.5 text-xs text-[#292929]/75">
                        {method.desc}
                      </span>
                    </div>
                  </label>
                ))}
              </div>

              {customer.deliveryMethod !== 'boutique-collection' && (
                <div className="pt-4 space-y-4 border-t border-[#101010]/10">
                  <div>
                    <label
                      htmlFor="chk-address"
                      className="block text-[11px] uppercase tracking-[0.14em] text-[#292929]/75 mb-1.5"
                    >
                      Street Address *
                    </label>
                    <input
                      id="chk-address"
                      type="text"
                      value={customer.address}
                      onChange={(e) => updateField('address', e.target.value)}
                      className="w-full h-11 px-3.5 bg-[#F7F4EE]/40 border border-[#101010]/20 text-sm focus:outline-none focus:border-[#C6A66A]"
                    />
                    {fieldErrors.address && (
                      <p className="mt-1 text-xs text-rose-700">{fieldErrors.address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label
                        htmlFor="chk-city"
                        className="block text-[11px] uppercase tracking-[0.14em] text-[#292929]/75 mb-1.5"
                      >
                        City *
                      </label>
                      <input
                        id="chk-city"
                        type="text"
                        value={customer.city}
                        onChange={(e) => updateField('city', e.target.value)}
                        className="w-full h-11 px-3.5 bg-[#F7F4EE]/40 border border-[#101010]/20 text-sm focus:outline-none focus:border-[#C6A66A]"
                      />
                      {fieldErrors.city && (
                        <p className="mt-1 text-xs text-rose-700">{fieldErrors.city}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="chk-postal"
                        className="block text-[11px] uppercase tracking-[0.14em] text-[#292929]/75 mb-1.5"
                      >
                        Postal Code *
                      </label>
                      <input
                        id="chk-postal"
                        type="text"
                        value={customer.postalCode}
                        onChange={(e) => updateField('postalCode', e.target.value)}
                        className="w-full h-11 px-3.5 bg-[#F7F4EE]/40 border border-[#101010]/20 text-sm focus:outline-none focus:border-[#C6A66A]"
                      />
                      {fieldErrors.postalCode && (
                        <p className="mt-1 text-xs text-rose-700">{fieldErrors.postalCode}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="chk-country"
                        className="block text-[11px] uppercase tracking-[0.14em] text-[#292929]/75 mb-1.5"
                      >
                        Country *
                      </label>
                      <input
                        id="chk-country"
                        type="text"
                        value={customer.country}
                        onChange={(e) => updateField('country', e.target.value)}
                        className="w-full h-11 px-3.5 bg-[#F7F4EE]/40 border border-[#101010]/20 text-sm focus:outline-none focus:border-[#C6A66A]"
                      />
                      {fieldErrors.country && (
                        <p className="mt-1 text-xs text-rose-700">{fieldErrors.country}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="chk-gift-msg"
                  className="block text-[11px] uppercase tracking-[0.14em] text-[#292929]/75 mb-1.5"
                >
                  Wax-Sealed Gift Card Message (Optional)
                </label>
                <textarea
                  id="chk-gift-msg"
                  rows={2}
                  value={customer.giftMessage}
                  onChange={(e) => updateField('giftMessage', e.target.value)}
                  placeholder="Handwritten in calligraphy on ivory cotton card..."
                  className="w-full p-3 bg-[#F7F4EE]/40 border border-[#101010]/20 text-sm focus:outline-none focus:border-[#C6A66A]"
                />
              </div>
            </section>
          </div>

          {/* Right Column: Order Summary */}
          <aside className="lg:col-span-5 bg-white border border-[#101010]/10 p-6 sm:p-8 lg:sticky lg:top-24 space-y-6">
            <h2 className="font-serif text-2xl text-[#101010] pb-4 border-b border-[#101010]/10">
              Order Summary
            </h2>

            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.key} className="flex gap-4">
                  <div className="w-16 h-16 bg-[#E9E1D5] shrink-0 overflow-hidden">
                    <LuxuryImage
                      src={item.image}
                      alt={item.name}
                      fallbackTitle={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <p className="font-serif text-base text-[#101010] truncate">
                        {item.name}
                      </p>
                      <span className="text-sm font-medium tabular-nums">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                    <p className="text-xs text-[#292929]/70 tabular-nums">
                      {item.size} · Qty {item.quantity}
                    </p>
                    {item.engraving && (
                      <p className="text-[11px] text-[#C6A66A] uppercase tracking-[0.1em]">
                        Monogram: {item.engraving}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-[#101010]/10 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-[#292929]/80">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatCurrency(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#292929]/80">
                <span>Delivery</span>
                <span className="tabular-nums">
                  {totals.shipping === 0 ? 'Complimentary' : formatCurrency(totals.shipping)}
                </span>
              </div>
              <div className="flex justify-between text-[#292929]/80">
                <span>Estimated Duties &amp; Tax</span>
                <span className="tabular-nums">{formatCurrency(totals.tax)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-[#101010]/10 text-base font-medium text-[#101010]">
                <span>Total</span>
                <span className="tabular-nums text-lg">{formatCurrency(totals.total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              data-testid="confirm-order-button"
              className="w-full h-12 bg-[#101010] text-xs font-medium tracking-[0.18em] uppercase text-[#F7F4EE] hover:bg-[#292929] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Lock className="w-3.5 h-3.5 text-[#C6A66A]" />
              <span>{submitting ? 'Confirming Reservation...' : 'Confirm Order'}</span>
            </button>

            <p className="text-[11px] leading-relaxed text-[#292929]/65 text-center">
              Includes two complimentary vial samples and signature ivory ribbon coffret.
            </p>
          </aside>
        </form>
      </div>
    </main>
  );
}

export function OrderConfirmationView({
  order,
  onNavigate,
}: {
  order: OrderRecord | undefined;
  onNavigate: (view: AppView) => void;
}) {
  if (!order) {
    return (
      <main className="bg-[#F7F4EE] min-h-[70vh] flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="font-serif text-3xl">Order Reference Not Found</h1>
          <button
            type="button"
            onClick={() => onNavigate({ page: 'home' })}
            className="mt-6 h-11 px-6 bg-[#101010] text-xs uppercase tracking-[0.16em] text-[#F7F4EE]"
          >
            Return Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#F7F4EE] py-16 sm:py-24 min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-8">
        <div className="bg-white border border-[#101010]/15 p-8 sm:p-12 space-y-8">
          <div className="text-center space-y-3 pb-8 border-b border-[#101010]/10">
            <CheckCircle2 className="w-10 h-10 mx-auto text-[#C6A66A]" strokeWidth={1.3} />
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#C6A66A]">
              Order {order.id} Confirmed
            </p>
            <h1 className="font-serif text-4xl text-[#101010]">
              Preparing Your Parisian Coffret
            </h1>
            <p className="text-sm text-[#292929]/75 max-w-md mx-auto">
              A confirmation dossier has been prepared for{' '}
              <span className="font-medium text-[#101010]">{order.customer.email}</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div>
              <h2 className="text-[11px] uppercase tracking-[0.16em] text-[#292929]/65 mb-2">
                Client &amp; Destination
              </h2>
              <p className="font-medium text-[#101010]">
                {order.customer.firstName} {order.customer.lastName}
              </p>
              {order.customer.deliveryMethod === 'boutique-collection' ? (
                <p className="text-[#292929]/80 mt-1">
                  Boutique Reserve &amp; Collect · 24 Place Vendôme, Paris
                </p>
              ) : (
                <p className="text-[#292929]/80 mt-1">
                  {order.customer.address}, {order.customer.city} {order.customer.postalCode},{' '}
                  {order.customer.country}
                </p>
              )}
              <p className="text-[#292929]/70 mt-1 tabular-nums">{order.customer.phone}</p>
            </div>

            <div>
              <h2 className="text-[11px] uppercase tracking-[0.16em] text-[#292929]/65 mb-2">
                Fulfillment Status
              </h2>
              <p className="font-medium text-[#101010]">{order.status}</p>
              <p className="text-[#292929]/80 mt-1">
                {order.customer.deliveryMethod === 'cash-on-delivery'
                  ? 'Private Courier · Cash on Delivery'
                  : order.customer.deliveryMethod === 'boutique-collection'
                  ? 'Place Vendôme Salon Pickup'
                  : 'Express Tracked Courier'}
              </p>
            </div>
          </div>

          <div className="border-t border-[#101010]/10 pt-6 space-y-4">
            <h2 className="text-[11px] uppercase tracking-[0.16em] text-[#292929]/65">
              Items Reserved
            </h2>
            <ul className="space-y-3">
              {order.items.map((item) => (
                <li key={item.key} className="flex justify-between text-sm">
                  <span>
                    {item.name} ({item.size}) × {item.quantity}
                    {item.engraving ? ` · Engraved "${item.engraving}"` : ''}
                  </span>
                  <span className="tabular-nums font-medium">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="border-t border-[#101010]/10 pt-4 space-y-1.5 text-sm">
              <div className="flex justify-between text-[#292929]/75">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#292929]/75">
                <span>Shipping</span>
                <span className="tabular-nums">
                  {order.shipping === 0 ? 'Complimentary' : formatCurrency(order.shipping)}
                </span>
              </div>
              <div className="flex justify-between text-[#292929]/75">
                <span>Tax</span>
                <span className="tabular-nums">{formatCurrency(order.tax)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#101010]/10 text-base font-medium">
                <span>Total</span>
                <span className="tabular-nums">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate({ page: 'collections', initialCollection: 'all' })}
              className="h-11 px-7 bg-[#101010] text-xs uppercase tracking-[0.16em] text-[#F7F4EE]"
            >
              Explore More Creations
            </button>
            <button
              type="button"
              onClick={() => onNavigate({ page: 'home' })}
              className="h-11 px-7 border border-[#101010]/25 text-xs uppercase tracking-[0.16em] text-[#101010]"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
