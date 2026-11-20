import { useEffect, useState, useCallback } from 'react';
import type {
  AppView,
  BottleSizeLabel,
  CartItem,
  CheckoutCustomer,
  Fragrance,
  OrderRecord,
  ProductReview,
} from './types/fragrance.ts';
import { FRAGRANCES } from './data/catalog.ts';
import { Navbar } from './components/Navbar.tsx';
import { HomePage } from './components/HomePage.tsx';
import { CollectionPage } from './components/CollectionPage.tsx';
import { ProductDetailPage } from './components/ProductDetailPage.tsx';
import { CheckoutPage, OrderConfirmationView } from './components/CheckoutPage.tsx';
import { StoryPage } from './components/StoryPage.tsx';
import { AtelierPage } from './components/AtelierPage.tsx';
import { Footer } from './components/Footer.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { QuickViewModal } from './components/QuickViewModal.tsx';
import { SearchOverlay } from './components/SearchOverlay.tsx';
import { WishlistDrawer } from './components/WishlistDrawer.tsx';
import { AccountDrawer } from './components/AccountDrawer.tsx';
import { FragranceQuizModal } from './components/FragranceQuizModal.tsx';

const CART_STORAGE_KEY = 'noira_cart_v1';
const WISHLIST_STORAGE_KEY = 'noira_wishlist_v1';

function readStoredCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readStoredWishlist(): string[] {
  try {
    const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [products, setProducts] = useState<Fragrance[]>(FRAGRANCES);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [cart, setCart] = useState<CartItem[]>(readStoredCart);
  const [wishlistIds, setWishlistIds] = useState<string[]>(readStoredWishlist);
  const [view, setView] = useState<AppView>({ page: 'home' });
  const [catalogSearchQuery, setCatalogSearchQuery] = useState('');

  // Drawers & Modals
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Fragrance | null>(null);

  // Persist cart & wishlist
  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Ignore storage quota errors
    }
  }, [cart]);

  useEffect(() => {
    try {
      window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds));
    } catch {
      // Ignore storage quota errors
    }
  }, [wishlistIds]);

  // Hydrate catalog & orders from backend
  useEffect(() => {
    let active = true;
    fetch('/api/products')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.products?.length) {
          setProducts(data.products);
        }
      })
      .catch(() => {
        // Keep bundled catalog as resilient initial seed
      });

    fetch('/api/orders')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && Array.isArray(data?.orders)) {
          setOrders(data.orders);
        }
      })
      .catch(() => {
        // Non-fatal
      });

    return () => {
      active = false;
    };
  }, []);

  const navigate = useCallback((nextView: AppView) => {
    if (nextView.page !== 'collections') {
      setCatalogSearchQuery('');
    }
    setView(nextView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const addToCart = useCallback(
    (
      product: Fragrance,
      size: BottleSizeLabel,
      engraving?: string,
      quantity = 1,
      openDrawer = true,
    ) => {
      const sizeOption =
        product.sizes.find((s) => s.size === size) ?? product.sizes[0];
      const normalizedEngraving = engraving ? engraving.slice(0, 3).toUpperCase() : '';
      const key = `${product.id}::${sizeOption.size}::${normalizedEngraving}`;

      setCart((prev) => {
        const existing = prev.find((item) => item.key === key);
        if (existing) {
          return prev.map((item) =>
            item.key === key
              ? { ...item, quantity: Math.min(10, item.quantity + quantity) }
              : item,
          );
        }
        return [
          ...prev,
          {
            key,
            productId: product.id,
            slug: product.slug,
            name: product.name,
            concentration: product.concentration,
            image: product.images[0],
            size: sizeOption.size,
            price: sizeOption.price,
            quantity,
            engraving: normalizedEngraving || undefined,
          },
        ];
      });

      if (openDrawer) {
        setCartOpen(true);
      }
    },
    [],
  );

  const buyNow = useCallback(
    (
      product: Fragrance,
      size: BottleSizeLabel,
      engraving?: string,
      quantity = 1,
    ) => {
      addToCart(product, size, engraving, quantity, false);
      setCartOpen(false);
      navigate({ page: 'checkout' });
    },
    [addToCart, navigate],
  );

  const updateCartQuantity = useCallback((key: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.key === key
            ? { ...item, quantity: item.quantity + delta }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const removeCartItem = useCallback((key: string) => {
    setCart((prev) => prev.filter((item) => item.key !== key));
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  }, []);

  const handleSubscribeNewsletter = useCallback(async (email: string) => {
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { ok: false, message: data.error ?? 'Unable to subscribe.' };
      }
      return { ok: true, message: data.message };
    } catch {
      return { ok: false, message: 'Unable to reach Maison Noira concierge.' };
    }
  }, []);

  const handlePlaceOrder = useCallback(
    async (customer: CheckoutCustomer) => {
      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customer, items: cart }),
        });
        const data = await res.json();
        if (!res.ok) {
          return {
            ok: false,
            error: data.error ?? 'Order submission failed.',
            fields: data.fields,
          };
        }
        const order = data.order as OrderRecord;
        setOrders((prev) => [order, ...prev]);
        setCart([]);
        return { ok: true, order };
      } catch {
        return { ok: false, error: 'Network error submitting order.' };
      }
    },
    [cart],
  );

  const handleSubmitReview = useCallback(
    async (
      productId: string,
      review: {
        author: string;
        location: string;
        rating: number;
        title: string;
        comment: string;
      },
    ): Promise<{ ok: boolean; error?: string; review?: ProductReview }> => {
      try {
        const res = await fetch(`/api/reviews/${productId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(review),
        });
        const data = await res.json();
        if (!res.ok) {
          return { ok: false, error: data.error ?? 'Unable to save review.' };
        }
        if (data.product) {
          setProducts((prev) =>
            prev.map((p) => (p.id === productId ? data.product : p)),
          );
        }
        return { ok: true, review: data.review };
      } catch {
        return { ok: false, error: 'Network error publishing review.' };
      }
    },
    [],
  );

  const totalBagCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const activeProduct =
    view.page === 'product'
      ? products.find((p) => p.slug === view.slug) ?? products[0]
      : null;

  const confirmedOrder =
    view.page === 'confirmation'
      ? orders.find((o) => o.id === view.orderId)
      : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EE] text-[#101010]">
      <Navbar
        currentView={view}
        cartCount={totalBagCount}
        wishlistCount={wishlistIds.length}
        featuredProducts={products}
        onNavigate={navigate}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenAccount={() => setAccountOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
        onOpenCart={() => setCartOpen(true)}
      />

      <div className="flex-1">
        {view.page === 'home' && (
          <HomePage
            products={products}
            wishlistIds={wishlistIds}
            onNavigate={navigate}
            onQuickView={setQuickViewProduct}
            onToggleWishlist={toggleWishlist}
            onAddToCart={(product, size, engraving) =>
              addToCart(product, size, engraving, 1, true)
            }
            onOpenQuiz={() => setQuizOpen(true)}
            onSubscribeNewsletter={handleSubscribeNewsletter}
          />
        )}

        {view.page === 'collections' && (
          <CollectionPage
            products={products}
            wishlistIds={wishlistIds}
            initialCollection={view.initialCollection ?? 'all'}
            initialFamily={view.initialFamily ?? 'all'}
            initialSearch={catalogSearchQuery}
            onNavigate={navigate}
            onQuickView={setQuickViewProduct}
            onToggleWishlist={toggleWishlist}
            onAddToCart={(product, size) => addToCart(product, size, undefined, 1, true)}
          />
        )}

        {view.page === 'product' && activeProduct && (
          <ProductDetailPage
            product={activeProduct}
            allProducts={products}
            wishlistIds={wishlistIds}
            onNavigate={navigate}
            onAddToCart={(product, size, engraving, quantity) =>
              addToCart(product, size, engraving, quantity, true)
            }
            onBuyNow={buyNow}
            onToggleWishlist={toggleWishlist}
            onQuickView={setQuickViewProduct}
            onSubmitReview={handleSubmitReview}
          />
        )}

        {view.page === 'checkout' && (
          <CheckoutPage
            items={cart}
            onNavigate={navigate}
            onPlaceOrder={handlePlaceOrder}
          />
        )}

        {view.page === 'confirmation' && (
          <OrderConfirmationView order={confirmedOrder} onNavigate={navigate} />
        )}

        {view.page === 'story' && <StoryPage onNavigate={navigate} />}

        {view.page === 'atelier' && (
          <AtelierPage products={products} onNavigate={navigate} />
        )}
      </div>

      <Footer
        onNavigate={navigate}
        onSubscribeNewsletter={handleSubscribeNewsletter}
      />

      {/* Interactive Drawers & Modals */}
      <CartDrawer
        isOpen={cartOpen}
        items={cart}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeCartItem}
        onCheckout={() => {
          setCartOpen(false);
          navigate({ page: 'checkout' });
        }}
        onExploreFragrances={() =>
          navigate({ page: 'collections', initialCollection: 'all' })
        }
      />

      <QuickViewModal
        product={quickViewProduct}
        isWishlisted={
          quickViewProduct ? wishlistIds.includes(quickViewProduct.id) : false
        }
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={(product, size) => addToCart(product, size, undefined, 1, true)}
        onToggleWishlist={toggleWishlist}
        onViewDetails={(slug) => navigate({ page: 'product', slug })}
      />

      <SearchOverlay
        isOpen={searchOpen}
        products={products}
        onClose={() => setSearchOpen(false)}
        onSelectProduct={(slug) => navigate({ page: 'product', slug })}
        onExploreSearch={(query) => {
          setCatalogSearchQuery(query);
          navigate({ page: 'collections', initialCollection: 'all' });
        }}
      />

      <WishlistDrawer
        isOpen={wishlistOpen}
        products={products}
        wishlistIds={wishlistIds}
        onClose={() => setWishlistOpen(false)}
        onRemoveWishlist={toggleWishlist}
        onAddToCart={(product, size) => addToCart(product, size, undefined, 1, true)}
        onSelectProduct={(slug) => navigate({ page: 'product', slug })}
      />

      <AccountDrawer
        isOpen={accountOpen}
        orders={orders}
        onClose={() => setAccountOpen(false)}
        onViewOrder={(orderId) => navigate({ page: 'confirmation', orderId })}
        onOpenAtelier={() => navigate({ page: 'atelier' })}
      />

      <FragranceQuizModal
        isOpen={quizOpen}
        products={products}
        onClose={() => setQuizOpen(false)}
        onSelectProduct={(slug) => navigate({ page: 'product', slug })}
        onAddToCart={(product, size) => addToCart(product, size, undefined, 1, true)}
      />
    </div>
  );
}
