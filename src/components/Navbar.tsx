import { useState } from 'react';
import { Search, User, Heart, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import type { AppView, CollectionKey, Fragrance } from '../types/fragrance.ts';
import { COLLECTIONS } from '../data/catalog.ts';
import { LuxuryImage } from './LuxuryImage.tsx';

interface NavbarProps {
  currentView: AppView;
  cartCount: number;
  wishlistCount: number;
  featuredProducts: Fragrance[];
  onNavigate: (view: AppView) => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
  onOpenWishlist: () => void;
  onOpenCart: () => void;
}

export function Navbar({
  currentView,
  cartCount,
  wishlistCount,
  featuredProducts,
  onNavigate,
  onOpenSearch,
  onOpenAccount,
  onOpenWishlist,
  onOpenCart,
}: NavbarProps) {
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigateToCollection = (collection: CollectionKey, category?: 'For Him' | 'For Her') => {
    setMegaMenuOpen(false);
    setMobileMenuOpen(false);
    if (category) {
      onNavigate({
        page: 'collections',
        initialCollection: category === 'For Him' ? 'masculine' : 'feminine',
      });
      return;
    }
    onNavigate({ page: 'collections', initialCollection: collection });
  };

  const navLinkClass = (active: boolean) =>
    `text-xs uppercase tracking-[0.16em] transition-colors whitespace-nowrap shrink-0 py-1 border-b ${
      active
        ? 'border-[#C6A66A] text-[#101010]'
        : 'border-transparent text-[#292929] hover:text-[#101010] hover:border-[#C6A66A]/60'
    }`;

  return (
    <header
      className="sticky top-0 z-40 w-full bg-[#F7F4EE]/95 backdrop-blur-md border-b border-[#101010]/10"
      onMouseLeave={() => setMegaMenuOpen(false)}
    >
      {/* Dismissible Slim Announcement Bar (<= 34px) */}
      {showAnnouncement && (
        <div className="bg-[#101010] text-[#F7F4EE] px-4 py-1.5 text-center relative flex items-center justify-center">
          <p className="text-[11px] tracking-[0.14em] uppercase truncate pr-8">
            Complimentary Express Delivery
            <span className="hidden sm:inline"> &amp; Two Artisanal Vial Samples</span>{' '}
            Over $250
          </p>
          <button
            type="button"
            onClick={() => setShowAnnouncement(false)}
            aria-label="Dismiss announcement"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#F7F4EE]/70 hover:text-[#C6A66A] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Three-Zone Navigation Bar */}
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark + Mobile Menu Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="xl:hidden flex h-11 w-11 items-center justify-center text-[#101010] hover:text-[#C6A66A] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <button
            type="button"
            onClick={() => {
              setMegaMenuOpen(false);
              onNavigate({ page: 'home' });
            }}
            className="font-serif text-2xl sm:text-[26px] font-medium tracking-[0.28em] uppercase text-[#101010] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A66A]"
          >
            NOIRA
          </button>
        </div>

        {/* Zone 2: Primary Text Links (single line) */}
        <nav aria-label="Primary navigation" className="hidden xl:flex items-center gap-7">
          <button
            type="button"
            onClick={() => {
              setMegaMenuOpen(false);
              onNavigate({ page: 'home' });
            }}
            className={navLinkClass(currentView.page === 'home')}
          >
            Home
          </button>

          <button
            type="button"
            onMouseEnter={() => setMegaMenuOpen(true)}
            onClick={() => navigateToCollection('all')}
            aria-expanded={megaMenuOpen}
            className={`${navLinkClass(
              currentView.page === 'collections' &&
                (!currentView.initialCollection || currentView.initialCollection === 'all'),
            )} inline-flex items-center gap-1`}
          >
            <span>Fragrances</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          <button
            type="button"
            onMouseEnter={() => setMegaMenuOpen(true)}
            onClick={() => navigateToCollection('signature')}
            className={navLinkClass(
              currentView.page === 'collections' &&
                (currentView.initialCollection === 'signature' ||
                  currentView.initialCollection === 'exclusive'),
            )}
          >
            Collections
          </button>

          <button
            type="button"
            onClick={() => navigateToCollection('masculine', 'For Him')}
            className={navLinkClass(
              currentView.page === 'collections' &&
                currentView.initialCollection === 'masculine',
            )}
          >
            For Him
          </button>

          <button
            type="button"
            onClick={() => navigateToCollection('feminine', 'For Her')}
            className={navLinkClass(
              currentView.page === 'collections' &&
                currentView.initialCollection === 'feminine',
            )}
          >
            For Her
          </button>

          <button
            type="button"
            onClick={() => navigateToCollection('gifts')}
            className={navLinkClass(
              currentView.page === 'collections' &&
                currentView.initialCollection === 'gifts',
            )}
          >
            Gifts
          </button>

          <button
            type="button"
            onClick={() => {
              setMegaMenuOpen(false);
              onNavigate({ page: 'story' });
            }}
            className={navLinkClass(currentView.page === 'story')}
          >
            Our Story
          </button>
        </nav>

        {/* Zone 3: Utility Action Cluster */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Search fragrances"
            className="flex h-11 w-11 items-center justify-center text-[#101010] hover:text-[#C6A66A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A66A]"
          >
            <Search className="w-[18px] h-[18px]" strokeWidth={1.6} />
          </button>

          <button
            type="button"
            onClick={onOpenAccount}
            aria-label="Account and order history"
            className="hidden sm:flex h-11 w-11 items-center justify-center text-[#101010] hover:text-[#C6A66A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A66A]"
          >
            <User className="w-[18px] h-[18px]" strokeWidth={1.6} />
          </button>

          <button
            type="button"
            onClick={onOpenWishlist}
            aria-label={`Wishlist (${wishlistCount} saved)`}
            className="relative flex h-11 w-11 items-center justify-center text-[#101010] hover:text-[#C6A66A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A66A]"
          >
            <Heart className="w-[18px] h-[18px]" strokeWidth={1.6} />
            {wishlistCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 bg-[#C6A66A] text-[#101010] text-[10px] font-semibold tabular-nums flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Shopping bag (${cartCount} items)`}
            data-testid="open-cart-button"
            className="relative flex h-11 px-2.5 items-center gap-2 text-[#101010] hover:text-[#C6A66A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A66A]"
          >
            <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.6} />
            <span className="text-xs font-medium tracking-[0.12em] uppercase tabular-nums">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Editorial Mega-Menu Dropdown */}
      {megaMenuOpen && (
        <div
          className="hidden xl:block absolute left-0 right-0 top-full bg-[#F7F4EE] border-b border-[#101010]/15 shadow-2xl"
          onMouseEnter={() => setMegaMenuOpen(true)}
          onMouseLeave={() => setMegaMenuOpen(false)}
        >
          <div className="mx-auto max-w-[1440px] px-8 py-10 grid grid-cols-12 gap-8">
            <div className="col-span-3 space-y-4 border-r border-[#101010]/10 pr-6">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#C6A66A] font-medium">
                Olfactory Houses
              </p>
              <ul className="space-y-2.5">
                {COLLECTIONS.map((col) => (
                  <li key={col.key}>
                    <button
                      type="button"
                      onClick={() => navigateToCollection(col.key)}
                      className="text-sm text-[#101010] hover:text-[#C6A66A] transition-colors text-left"
                    >
                      {col.title}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    onClick={() => navigateToCollection('gifts')}
                    className="text-sm text-[#101010] hover:text-[#C6A66A] transition-colors text-left"
                  >
                    EXCLUSIVE GIFT COFFRETS
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setMegaMenuOpen(false);
                      onNavigate({ page: 'atelier' });
                    }}
                    className="text-sm font-medium text-[#101010] underline underline-offset-4 decoration-[#C6A66A] hover:text-[#C6A66A] transition-colors text-left"
                  >
                    Atelier Sur Mesure
                  </button>
                </li>
              </ul>
            </div>

            <div className="col-span-9 grid grid-cols-3 gap-6">
              {featuredProducts.slice(0, 3).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setMegaMenuOpen(false);
                    onNavigate({ page: 'product', slug: item.slug });
                  }}
                  className="group text-left bg-white border border-[#101010]/10 overflow-hidden transition-colors hover:border-[#C6A66A]"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-[#E9E1D5]">
                    <LuxuryImage
                      src={item.images[0]}
                      alt={item.name}
                      fallbackTitle={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[#292929]/70">
                      {item.concentration}
                    </p>
                    <p className="mt-1 font-serif text-lg text-[#101010]">
                      {item.name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile / Tablet Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-[#101010]/10 bg-[#F7F4EE] px-6 py-6 space-y-5">
          <nav aria-label="Mobile navigation" className="flex flex-col space-y-3">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate({ page: 'home' });
              }}
              className="py-2 text-left text-sm uppercase tracking-[0.16em] text-[#101010] border-b border-[#101010]/10"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => navigateToCollection('all')}
              className="py-2 text-left text-sm uppercase tracking-[0.16em] text-[#101010] border-b border-[#101010]/10"
            >
              All Fragrances
            </button>
            <button
              type="button"
              onClick={() => navigateToCollection('signature')}
              className="py-2 text-left text-sm uppercase tracking-[0.16em] text-[#101010] border-b border-[#101010]/10"
            >
              Collections
            </button>
            <button
              type="button"
              onClick={() => navigateToCollection('masculine', 'For Him')}
              className="py-2 text-left text-sm uppercase tracking-[0.16em] text-[#101010] border-b border-[#101010]/10"
            >
              For Him
            </button>
            <button
              type="button"
              onClick={() => navigateToCollection('feminine', 'For Her')}
              className="py-2 text-left text-sm uppercase tracking-[0.16em] text-[#101010] border-b border-[#101010]/10"
            >
              For Her
            </button>
            <button
              type="button"
              onClick={() => navigateToCollection('gifts')}
              className="py-2 text-left text-sm uppercase tracking-[0.16em] text-[#101010] border-b border-[#101010]/10"
            >
              Gifts
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate({ page: 'atelier' });
              }}
              className="py-2 text-left text-sm uppercase tracking-[0.16em] text-[#C6A66A] font-medium border-b border-[#101010]/10"
            >
              Atelier Sur Mesure
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate({ page: 'story' });
              }}
              className="py-2 text-left text-sm uppercase tracking-[0.16em] text-[#101010] border-b border-[#101010]/10"
            >
              Our Story
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAccount();
              }}
              className="py-2 text-left text-sm uppercase tracking-[0.16em] text-[#292929]"
            >
              Account &amp; Order History
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
