import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import type {
  AppView,
  BottleSizeLabel,
  CollectionKey,
  Fragrance,
  FragranceFamily,
} from '../types/fragrance.ts';
import { COLLECTIONS, OLFACTORY_FAMILIES } from '../data/catalog.ts';
import { filterFragrances, formatCurrency } from '../utils/commerce.ts';
import { LuxuryImage } from './LuxuryImage.tsx';
import { ProductCard } from './ProductCard.tsx';

interface HomePageProps {
  products: Fragrance[];
  wishlistIds: string[];
  onNavigate: (view: AppView) => void;
  onQuickView: (product: Fragrance) => void;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Fragrance, size: BottleSizeLabel, engraving?: string) => void;
  onOpenQuiz: () => void;
  onSubscribeNewsletter: (email: string) => Promise<{ ok: boolean; message: string }>;
}

export function HomePage({
  products,
  wishlistIds,
  onNavigate,
  onQuickView,
  onToggleWishlist,
  onAddToCart,
  onOpenQuiz,
  onSubscribeNewsletter,
}: HomePageProps) {
  const [activeFamily, setActiveFamily] = useState<FragranceFamily>('Oriental');
  const [giftMonogram, setGiftMonogram] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterFeedback, setNewsletterFeedback] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);
  const [newsletterBusy, setNewsletterBusy] = useState(false);

  const bestsellers = products.filter((p) => !p.isGift).slice(0, 6);
  const giftProduct = products.find((p) => p.isGift) ?? products[0];

  const familyMatches = filterFragrances(products, {
    collection: 'all',
    category: 'all',
    family: activeFamily,
    size: 'all',
    priceRange: 'all',
    searchQuery: '',
  }).slice(0, 3);

  const activeFamilyMeta =
    OLFACTORY_FAMILIES.find((item) => item.family === activeFamily) ??
    OLFACTORY_FAMILIES[0];

  const handleCollectionSelect = (collection: CollectionKey) => {
    onNavigate({ page: 'collections', initialCollection: collection });
  };

  const handleNewsletterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterBusy(true);
    const res = await onSubscribeNewsletter(newsletterEmail.trim());
    setNewsletterFeedback(res);
    if (res.ok) setNewsletterEmail('');
    setNewsletterBusy(false);
  };

  return (
    <main>
      {/* C. Cinematic Full-Screen Hero Campaign */}
      <section className="relative min-h-[84vh] w-full bg-[#101010] text-[#F7F4EE] overflow-hidden flex items-end">
        <div className="absolute inset-0">
          <LuxuryImage
            src="/src/assets/images/hero_noira_campaign_1795192808642.jpg"
            alt="NOIRA Noir Éternel obsidian flacon on Nero Marquina marble"
            fallbackTitle="NOIRA"
            darkSurface
            className="w-full h-full object-cover object-center scale-[1.01]"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#101010]/95 via-[#101010]/50 to-[#101010]/20"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#101010]/85 via-[#101010]/30 to-transparent"
            aria-hidden="true"
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 sm:px-8 pb-16 sm:pb-24 pt-28">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <p className="text-xs uppercase tracking-[0.24em] text-[#C6A66A]">
              Maison Noira · Paris
            </p>
            <h1 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-[0.04em] leading-[1.08] text-[#F7F4EE] [text-wrap:balance]">
              THE ART OF AN UNFORGETTABLE PRESENCE
            </h1>
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-[#F7F4EE]/82 max-w-xl">
              Discover extraordinary fragrances crafted for those who leave a lasting impression.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => handleCollectionSelect('all')}
                className="h-12 px-8 bg-[#C6A66A] text-[#101010] text-xs font-semibold tracking-[0.18em] uppercase hover:bg-[#F7F4EE] transition-colors whitespace-nowrap"
              >
                Explore Collection
              </button>
              <button
                type="button"
                onClick={() => onNavigate({ page: 'story' })}
                className="h-12 px-8 border border-[#F7F4EE]/45 text-[#F7F4EE] text-xs font-medium tracking-[0.18em] uppercase hover:border-[#C6A66A] hover:text-[#C6A66A] transition-colors whitespace-nowrap"
              >
                Discover Our World
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* D. Brand Introduction */}
      <section className="bg-[#F7F4EE] py-20 sm:py-28 border-b border-[#101010]/10">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#C6A66A]">
              Haute Parfumerie
            </p>
            <h2 className="mt-4 font-serif text-3xl sm:text-5xl font-normal tracking-[0.03em] text-[#101010] [text-wrap:balance]">
              BEYOND FRAGRANCE. AN EXPRESSION OF IDENTITY.
            </h2>
            <p className="mt-6 text-base sm:text-lg leading-relaxed text-[#292929]/80">
              Each Noira extrait is composed as invisible architecture—raw Grasse absolutes, aged Assam agarwood, and cool Florentine iris macerated slowly in smoked glass so your signature lingers effortlessly on skin and cashmere.
            </p>
          </div>
        </div>
      </section>

      {/* E. Four Featured Collections */}
      <section className="bg-[#F7F4EE] py-20 sm:py-24">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#C6A66A]">
                Curated Worlds
              </p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-[#101010]">
                Signature Olfactory Collections
              </h2>
            </div>
            <button
              type="button"
              onClick={() => handleCollectionSelect('all')}
              className="text-xs uppercase tracking-[0.16em] text-[#101010] hover:text-[#C6A66A] inline-flex items-center gap-2 transition-colors self-start sm:self-auto"
            >
              <span>View Complete Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {COLLECTIONS.map((col) => (
              <article
                key={col.key}
                className="group bg-white border border-[#101010]/10 flex flex-col overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => handleCollectionSelect(col.key)}
                  className="relative aspect-[3/4] w-full overflow-hidden bg-[#101010] text-left"
                >
                  <LuxuryImage
                    src={col.image}
                    alt={col.title}
                    fallbackTitle={col.title}
                    darkSurface
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#101010]/85 via-[#101010]/20 to-transparent"
                    aria-hidden="true"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-[#F7F4EE]">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#C6A66A]">
                      {col.kicker}
                    </span>
                    <h3 className="mt-1.5 font-serif text-2xl tracking-[0.04em]">
                      {col.title}
                    </h3>
                  </div>
                </button>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <p className="text-sm leading-relaxed text-[#292929]/80">
                    {col.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCollectionSelect(col.key)}
                    className="mt-5 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-[#101010] hover:text-[#C6A66A] transition-colors self-start"
                  >
                    <span>Explore Collection</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* F. Bestselling Fragrances */}
      <section className="bg-[#E9E1D5]/45 py-20 sm:py-24 border-y border-[#101010]/10">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#C6A66A]">
                Iconic Creations
              </p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-[#101010]">
                Bestselling Fragrances
              </h2>
            </div>
            <button
              type="button"
              onClick={() => handleCollectionSelect('all')}
              className="h-11 px-6 border border-[#101010] text-xs font-medium uppercase tracking-[0.16em] text-[#101010] hover:bg-[#101010] hover:text-[#F7F4EE] transition-colors self-start sm:self-auto whitespace-nowrap"
            >
              Shop All Creations
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {bestsellers.map((product) => (
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
        </div>
      </section>

      {/* G. Brand Campaign Section */}
      <section className="relative bg-[#101010] text-[#F7F4EE] py-28 sm:py-36 overflow-hidden">
        <div className="absolute inset-0">
          <LuxuryImage
            src="/src/assets/images/campaign_scent_remains_1795192808469.jpg"
            alt="NOIRA candlelit campaign still life with iris petals and agarwood"
            fallbackTitle="SCENT IS THE SIGNATURE THAT REMAINS"
            darkSurface
            className="w-full h-full object-cover opacity-65"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#101010]/90 via-[#101010]/55 to-[#101010]/40"
            aria-hidden="true"
          />
        </div>
        <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] text-[#C6A66A]">
              Autumn / Winter Campaign
            </p>
            <h2 className="mt-4 font-serif text-4xl sm:text-5xl font-normal tracking-[0.04em] leading-[1.1] [text-wrap:balance]">
              SCENT IS THE SIGNATURE THAT REMAINS.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[#F7F4EE]/80 max-w-lg">
              Long after candlelight fades and velvet curtains draw closed, the dry-down of aged resin, iris pallida, and smoked cedar defines the memory of the room.
            </p>
            <div className="mt-8">
              <button
                type="button"
                onClick={() => onNavigate({ page: 'product', slug: 'noir-eternel' })}
                className="h-12 px-8 border border-[#C6A66A] text-[#C6A66A] text-xs font-medium tracking-[0.18em] uppercase hover:bg-[#C6A66A] hover:text-[#101010] transition-colors"
              >
                Experience Noir Éternel
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* H. Discover Your Fragrance — Interactive Family Explorer + Quiz + Atelier */}
      <section className="bg-[#F7F4EE] py-20 sm:py-24 border-b border-[#101010]/10">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#C6A66A]">
                Interactive Olfactory Atlas
              </p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-[#101010]">
                Discover Your Fragrance
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onOpenQuiz}
                className="h-11 px-6 bg-[#101010] text-[#F7F4EE] text-xs font-medium tracking-[0.16em] uppercase hover:bg-[#292929] transition-colors whitespace-nowrap"
              >
                Take Scent Quiz
              </button>
              <button
                type="button"
                onClick={() => onNavigate({ page: 'atelier' })}
                className="h-11 px-6 border border-[#101010] text-[#101010] text-xs font-medium tracking-[0.16em] uppercase hover:bg-[#101010] hover:text-[#F7F4EE] transition-colors inline-flex items-center gap-2 whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C6A66A]" />
                <span>Atelier Sur Mesure</span>
              </button>
            </div>
          </div>

          {/* 7 Fragrance Family Selector Tabs */}
          <div
            role="tablist"
            aria-label="Filter creations by olfactory family"
            className="flex flex-wrap gap-2 pb-8 border-b border-[#101010]/10"
          >
            {OLFACTORY_FAMILIES.map((item) => {
              const active = item.family === activeFamily;
              return (
                <button
                  key={item.family}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveFamily(item.family)}
                  className={`h-11 px-5 text-xs uppercase tracking-[0.16em] transition-colors border whitespace-nowrap ${
                    active
                      ? 'bg-[#101010] text-[#F7F4EE] border-[#101010]'
                      : 'bg-white text-[#101010] border-[#101010]/15 hover:border-[#C6A66A]'
                  }`}
                >
                  {item.family}
                </button>
              );
            })}
          </div>

          {/* Active Family Editorial Note + Matching Cards */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 bg-white border border-[#101010]/10 p-7 space-y-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#C6A66A]">
                Olfactory Accord
              </p>
              <h3 className="font-serif text-3xl text-[#101010]">
                {activeFamilyMeta.family}
              </h3>
              <p className="text-sm leading-relaxed text-[#292929]/80">
                {activeFamilyMeta.summary}
              </p>
              <p className="pt-3 border-t border-[#101010]/10 text-xs uppercase tracking-[0.12em] text-[#101010]">
                {activeFamilyMeta.keyNotes}
              </p>
              <button
                type="button"
                onClick={() =>
                  onNavigate({
                    page: 'collections',
                    initialCollection: 'all',
                    initialFamily: activeFamily,
                  })
                }
                className="pt-2 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-[#101010] hover:text-[#C6A66A]"
              >
                <span>Explore All {activeFamily} Scents</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {familyMatches.map((item) => {
                const defaultSize =
                  item.sizes.find((s) => s.size === '50ml')?.size ?? item.sizes[0].size;
                const price =
                  item.sizes.find((s) => s.size === defaultSize)?.price ??
                  item.sizes[0].price;
                return (
                  <div
                    key={item.id}
                    className="bg-white border border-[#101010]/10 flex flex-col justify-between"
                  >
                    <button
                      type="button"
                      onClick={() => onNavigate({ page: 'product', slug: item.slug })}
                      className="text-left group"
                    >
                      <div className="aspect-[4/3] bg-[#E9E1D5] overflow-hidden">
                        <LuxuryImage
                          src={item.images[0]}
                          alt={item.name}
                          fallbackTitle={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-5">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-[#292929]/65">
                          {item.concentration}
                        </p>
                        <h4 className="mt-1 font-serif text-xl text-[#101010]">
                          {item.name}
                        </h4>
                        <p className="mt-1.5 text-sm font-medium tabular-nums text-[#101010]">
                          {formatCurrency(price)} · {defaultSize}
                        </p>
                      </div>
                    </button>
                    <div className="px-5 pb-5">
                      <button
                        type="button"
                        onClick={() => onAddToCart(item, defaultSize)}
                        className="w-full h-10 bg-[#101010] text-[11px] uppercase tracking-[0.16em] text-[#F7F4EE] hover:bg-[#292929] transition-colors"
                      >
                        Add to Bag
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* I. Exclusive Gift Collection */}
      <section className="bg-white py-20 sm:py-24 border-b border-[#101010]/10">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          <div className="lg:col-span-6 aspect-[4/3] lg:aspect-auto bg-[#E9E1D5] overflow-hidden">
            <LuxuryImage
              src={giftProduct.images[0]}
              alt="NOIRA Exclusive Gift Coffret lined in ivory silk"
              fallbackTitle={giftProduct.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="lg:col-span-6 flex flex-col justify-center lg:pl-8 py-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#C6A66A]">
              L&apos;Art d&apos;Offrir
            </p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl text-[#101010]">
              The Exclusive Gift Collection
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#292929]/80">
              Presented in satin-lined obsidian coffrets with complimentary calligraphy engraving on the brass collar. Pair a 100ml flacon with our pocket travel atomizer for effortless ceremony.
            </p>

            <div className="mt-6 p-5 bg-[#F7F4EE] border border-[#101010]/10 space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-xl text-[#101010]">
                  {giftProduct.name}
                </span>
                <span className="text-base font-medium tabular-nums">
                  {formatCurrency(giftProduct.sizes[0].price)}
                </span>
              </div>

              <div>
                <label
                  htmlFor="gift-monogram-input"
                  className="block text-[11px] uppercase tracking-[0.14em] text-[#292929]/75"
                >
                  Complimentary Brass Monogram (Up to 3 Initials)
                </label>
                <input
                  id="gift-monogram-input"
                  type="text"
                  maxLength={3}
                  value={giftMonogram}
                  onChange={(e) => setGiftMonogram(e.target.value.toUpperCase())}
                  placeholder="e.g. C.L"
                  className="mt-2 w-full sm:w-56 h-11 px-4 bg-white border border-[#101010]/20 text-sm tracking-[0.2em] uppercase focus:outline-none focus:border-[#C6A66A]"
                />
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    onAddToCart(
                      giftProduct,
                      giftProduct.sizes[0].size,
                      giftMonogram.trim() || undefined,
                    )
                  }
                  className="h-11 px-7 bg-[#101010] text-xs font-medium tracking-[0.16em] uppercase text-[#F7F4EE] hover:bg-[#292929] transition-colors"
                >
                  Add Coffret to Bag
                </button>
                <button
                  type="button"
                  onClick={() => handleCollectionSelect('gifts')}
                  className="h-11 px-6 border border-[#101010]/25 text-xs font-medium tracking-[0.16em] uppercase text-[#101010] hover:border-[#101010]"
                >
                  View All Gifts
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* J. Brand Philosophy */}
      <section className="bg-[#F7F4EE] py-20 sm:py-24">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-5 order-2 lg:order-1">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#C6A66A]">
              Craftsmanship &amp; Provenance
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#101010]">
              Distilled Without Haste in Grasse &amp; Paris
            </h2>
            <p className="text-base leading-relaxed text-[#292929]/80">
              Every Noira formula begins at our master perfumer&apos;s organ with single-harvest Centifolia rose, sun-cured Florentine orris rhizomes aged three years, and cold-pressed Calabrian bergamot.
            </p>
            <p className="text-base leading-relaxed text-[#292929]/80">
              We never accelerate maceration. Each batch rests in temperature-controlled dark vats until sharp edges dissolve into seamless, resonant harmony.
            </p>
            <button
              type="button"
              onClick={() => onNavigate({ page: 'story' })}
              className="inline-flex items-center gap-2 pt-2 text-xs font-medium uppercase tracking-[0.16em] text-[#101010] hover:text-[#C6A66A]"
            >
              <span>Read the Maison Story</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="lg:col-span-7 aspect-[16/9] bg-[#292929] overflow-hidden order-1 lg:order-2">
            <LuxuryImage
              src="/src/assets/images/atelier_craftsmanship_1795192808946.jpg"
              alt="NOIRA master perfumer composing at the botanical fragrance organ"
              fallbackTitle="Maison Noira Atelier"
              darkSurface
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* K. Newsletter */}
      <section className="bg-[#E9E1D5]/60 py-20 border-t border-[#101010]/10">
        <div className="mx-auto max-w-2xl px-4 sm:px-8 text-center">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#C6A66A]">
            The Private Circle
          </p>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl text-[#101010]">
            ENTER OUR WORLD OF EXCLUSIVITY
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#292929]/80">
            Receive invitations to private salon tastings, numbered extrait releases, and seasonal fragrance journals.
          </p>

          <form
            onSubmit={handleNewsletterSubmit}
            className="mt-8 flex flex-col sm:flex-row gap-3"
          >
            <label htmlFor="home-newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="home-newsletter-email"
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 h-12 px-5 bg-white border border-[#101010]/20 text-sm text-[#101010] placeholder:text-[#292929]/45 focus:outline-none focus:border-[#C6A66A]"
            />
            <button
              type="submit"
              disabled={newsletterBusy}
              className="h-12 px-8 bg-[#101010] text-xs font-medium tracking-[0.18em] uppercase text-[#F7F4EE] hover:bg-[#292929] transition-colors whitespace-nowrap disabled:opacity-60"
            >
              {newsletterBusy ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>

          {newsletterFeedback && (
            <p
              className={`mt-4 text-xs tracking-[0.06em] ${
                newsletterFeedback.ok ? 'text-[#101010]' : 'text-rose-700'
              }`}
            >
              {newsletterFeedback.message}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
