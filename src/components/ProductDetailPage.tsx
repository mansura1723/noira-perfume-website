import { useState, useEffect, type FormEvent } from 'react';
import {
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  ChevronRight,
  Check,
  Star,
} from 'lucide-react';
import type {
  AppView,
  BottleSizeLabel,
  Fragrance,
  ProductReview,
} from '../types/fragrance.ts';
import { formatCurrency } from '../utils/commerce.ts';
import { LuxuryImage } from './LuxuryImage.tsx';
import { ProductCard } from './ProductCard.tsx';

interface ProductDetailPageProps {
  product: Fragrance;
  allProducts: Fragrance[];
  wishlistIds: string[];
  onNavigate: (view: AppView) => void;
  onAddToCart: (
    product: Fragrance,
    size: BottleSizeLabel,
    engraving?: string,
    quantity?: number,
  ) => void;
  onBuyNow: (
    product: Fragrance,
    size: BottleSizeLabel,
    engraving?: string,
    quantity?: number,
  ) => void;
  onToggleWishlist: (productId: string) => void;
  onQuickView: (product: Fragrance) => void;
  onSubmitReview: (
    productId: string,
    review: {
      author: string;
      location: string;
      rating: number;
      title: string;
      comment: string;
    },
  ) => Promise<{ ok: boolean; error?: string; review?: ProductReview }>;
}

export function ProductDetailPage({
  product,
  allProducts,
  wishlistIds,
  onNavigate,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  onQuickView,
  onSubmitReview,
}: ProductDetailPageProps) {
  const isWishlisted = wishlistIds.includes(product.id);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<BottleSizeLabel>(
    product.sizes.find((s) => s.size === '50ml')?.size ?? product.sizes[0].size,
  );
  const [quantity, setQuantity] = useState(1);
  const [engraving, setEngraving] = useState('');
  const [activeTab, setActiveTab] = useState<'story' | 'ingredients' | 'shipping'>('story');

  // Review submission state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [revAuthor, setRevAuthor] = useState('');
  const [revLocation, setRevLocation] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revTitle, setRevTitle] = useState('');
  const [revComment, setRevComment] = useState('');
  const [revFeedback, setRevFeedback] = useState<string | null>(null);
  const [revBusy, setRevBusy] = useState(false);

  useEffect(() => {
    setSelectedImageIdx(0);
    setSelectedSize(
      product.sizes.find((s) => s.size === '50ml')?.size ?? product.sizes[0].size,
    );
    setQuantity(1);
    setEngraving('');
  }, [product.id]);

  const activeSizeOption =
    product.sizes.find((s) => s.size === selectedSize) ?? product.sizes[0];

  const related = allProducts
    .filter((p) => p.id !== product.id && !p.isGift)
    .sort((a, b) => {
      const aMatch = a.primaryFamily === product.primaryFamily ? 1 : 0;
      const bMatch = b.primaryFamily === product.primaryFamily ? 1 : 0;
      return bMatch - aMatch;
    })
    .slice(0, 3);

  const handleReviewSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setRevBusy(true);
    setRevFeedback(null);
    const res = await onSubmitReview(product.id, {
      author: revAuthor,
      location: revLocation,
      rating: revRating,
      title: revTitle,
      comment: revComment,
    });
    if (res.ok) {
      setRevAuthor('');
      setRevLocation('');
      setRevTitle('');
      setRevComment('');
      setShowReviewForm(false);
      setRevFeedback('Thank you. Your reflection has been published to the Maison archive.');
    } else {
      setRevFeedback(res.error ?? 'Could not publish review.');
    }
    setRevBusy(false);
  };

  return (
    <main className="bg-[#F7F4EE] pb-24 md:pb-16">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 pt-6 pb-4">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[#292929]/70"
        >
          <button
            type="button"
            onClick={() => onNavigate({ page: 'home' })}
            className="hover:text-[#101010]"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button
            type="button"
            onClick={() => onNavigate({ page: 'collections', initialCollection: 'all' })}
            className="hover:text-[#101010]"
          >
            Fragrances
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#101010] font-medium truncate">{product.name}</span>
        </nav>
      </div>

      {/* Main Split: Sticky Gallery Left + Contiguous Purchase Module Right */}
      <section className="mx-auto max-w-[1440px] px-4 sm:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Gallery */}
          <div className="lg:col-span-7 lg:sticky lg:top-24 space-y-4">
            <div className="aspect-[4/3] w-full bg-[#E9E1D5] border border-[#101010]/10 overflow-hidden">
              <LuxuryImage
                src={product.images[selectedImageIdx] ?? product.images[0]}
                alt={`${product.name} view ${selectedImageIdx + 1}`}
                fallbackTitle={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={img + idx}
                    type="button"
                    onClick={() => setSelectedImageIdx(idx)}
                    aria-label={`View gallery image ${idx + 1}`}
                    className={`aspect-[4/3] bg-[#E9E1D5] overflow-hidden border transition-colors ${
                      selectedImageIdx === idx
                        ? 'border-[#101010] ring-1 ring-[#101010]'
                        : 'border-[#101010]/15 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <LuxuryImage
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      fallbackTitle={product.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Contiguous Purchase Module */}
          <div className="lg:col-span-5 bg-white border border-[#101010]/10 p-6 sm:p-10 space-y-6">
            <div>
              <div className="flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.16em] text-[#C6A66A] font-medium">
                <span>
                  {product.concentration} · {product.primaryFamily}
                </span>
                <a
                  href="#pdp-reviews"
                  className="text-[#101010] hover:text-[#C6A66A] tabular-nums"
                >
                  ★ {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                </a>
              </div>

              <h1 className="mt-3 font-serif text-4xl sm:text-[42px] font-normal tracking-[0.04em] text-[#101010]">
                {product.name}
              </h1>
              <p className="mt-1.5 text-xs uppercase tracking-[0.16em] text-[#292929]/70">
                {product.subtitle}
              </p>

              <p className="mt-5 text-2xl font-medium tabular-nums text-[#101010]">
                {formatCurrency(activeSizeOption.price)}
              </p>
              <p className="mt-1 text-xs text-[#292929]/65 tabular-nums">
                SKU {activeSizeOption.sku} ·{' '}
                {activeSizeOption.stock > 0
                  ? `${activeSizeOption.stock} flacons in Parisian vault`
                  : 'Currently out of stock'}
              </p>
            </div>

            <p className="text-sm sm:text-base leading-relaxed text-[#292929]/85 border-t border-[#101010]/10 pt-5">
              {product.shortDescription}
            </p>

            {/* Size Selector */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[0.16em] text-[#292929]/75">
                  Select Volume
                </span>
                <span className="text-xs text-[#292929]/65 tabular-nums">
                  {activeSizeOption.size}
                </span>
              </div>
              <div className="mt-2.5 grid grid-cols-3 gap-2.5">
                {product.sizes.map((opt) => {
                  const selected = opt.size === selectedSize;
                  return (
                    <button
                      key={opt.size}
                      type="button"
                      onClick={() => setSelectedSize(opt.size)}
                      className={`py-3 px-3 border text-center transition-colors ${
                        selected
                          ? 'bg-[#101010] text-[#F7F4EE] border-[#101010]'
                          : 'bg-[#F7F4EE]/50 text-[#101010] border-[#101010]/20 hover:border-[#101010]'
                      }`}
                    >
                      <span className="block text-xs font-medium uppercase tracking-[0.14em] tabular-nums">
                        {opt.size}
                      </span>
                      <span
                        className={`mt-0.5 block text-xs tabular-nums ${
                          selected ? 'text-[#C6A66A]' : 'text-[#292929]/70'
                        }`}
                      >
                        {formatCurrency(opt.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Complimentary Brass Engraving */}
            {product.engravable && (
              <div>
                <label
                  htmlFor="pdp-engraving-input"
                  className="block text-[11px] uppercase tracking-[0.16em] text-[#292929]/75"
                >
                  Complimentary Flacon Engraving (Optional, 3 Initials)
                </label>
                <input
                  id="pdp-engraving-input"
                  type="text"
                  maxLength={3}
                  value={engraving}
                  onChange={(e) => setEngraving(e.target.value.toUpperCase())}
                  placeholder="Initials e.g. J.V"
                  className="mt-2 w-full h-11 px-4 bg-[#F7F4EE]/50 border border-[#101010]/20 text-sm tracking-[0.2em] uppercase focus:outline-none focus:border-[#C6A66A]"
                />
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center border border-[#101010]/25 bg-[#F7F4EE]/40 h-12">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="h-full w-11 flex items-center justify-center text-[#101010] hover:bg-[#E9E1D5]/50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-medium tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    aria-label="Increase quantity"
                    className="h-full w-11 flex items-center justify-center text-[#101010] hover:bg-[#E9E1D5]/50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onAddToCart(
                      product,
                      selectedSize,
                      engraving.trim() || undefined,
                      quantity,
                    )
                  }
                  className="flex-1 h-12 bg-[#101010] text-xs font-medium tracking-[0.18em] uppercase text-[#F7F4EE] hover:bg-[#292929] transition-colors inline-flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" strokeWidth={1.6} />
                  <span>
                    Add to Bag · {formatCurrency(activeSizeOption.price * quantity)}
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    onBuyNow(
                      product,
                      selectedSize,
                      engraving.trim() || undefined,
                      quantity,
                    )
                  }
                  className="h-11 bg-[#C6A66A] text-[#101010] text-xs font-semibold tracking-[0.18em] uppercase hover:bg-[#101010] hover:text-[#F7F4EE] transition-colors"
                >
                  Buy Now
                </button>
                <button
                  type="button"
                  onClick={() => onToggleWishlist(product.id)}
                  className={`h-11 border text-xs font-medium tracking-[0.16em] uppercase inline-flex items-center justify-center gap-2 transition-colors ${
                    isWishlisted
                      ? 'bg-[#101010] text-[#C6A66A] border-[#101010]'
                      : 'bg-white text-[#101010] border-[#101010]/25 hover:border-[#101010]'
                  }`}
                >
                  <Heart
                    className="w-4 h-4"
                    fill={isWishlisted ? 'currentColor' : 'none'}
                  />
                  <span>{isWishlisted ? 'Saved to Wishlist' : 'Save to Wishlist'}</span>
                </button>
              </div>
            </div>

            {/* Detail Tabs: Story / Ingredients / Shipping */}
            <div className="pt-4 border-t border-[#101010]/10">
              <div className="flex gap-6 border-b border-[#101010]/10">
                {(
                  [
                    { key: 'story', label: 'Story' },
                    { key: 'ingredients', label: 'Ingredients' },
                    { key: 'shipping', label: 'Shipping' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`pb-2.5 text-xs uppercase tracking-[0.14em] border-b-2 transition-colors ${
                      activeTab === tab.key
                        ? 'border-[#C6A66A] text-[#101010] font-medium'
                        : 'border-transparent text-[#292929]/65 hover:text-[#101010]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="pt-4 text-sm leading-relaxed text-[#292929]/85">
                {activeTab === 'story' && <p>{product.editorialStory}</p>}
                {activeTab === 'ingredients' && <p>{product.ingredients}</p>}
                {activeTab === 'shipping' && (
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#C6A66A] shrink-0 mt-0.5" />
                      <span>
                        Complimentary tracked express courier delivery on orders over $250.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#C6A66A] shrink-0 mt-0.5" />
                      <span>
                        Includes two complimentary discovery vials to test before unsealing your flacon.
                      </span>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Olfactory Pyramid Architecture & Longevity / Sillage */}
      <section className="mx-auto max-w-[1440px] px-4 sm:px-8 py-16">
        <div className="bg-[#101010] text-[#F7F4EE] p-8 sm:p-14 border border-[#C6A66A]/20">
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#C6A66A]">
              Olfactory Architecture
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl">
              The Fragrance Pyramid
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-[#F7F4EE]/15 pt-10">
            {(
              [
                { tier: '01. Top Notes · First Impression', notes: product.notes.top },
                { tier: '02. Heart Notes · The Signature Core', notes: product.notes.heart },
                { tier: '03. Base Notes · Lingering Trail', notes: product.notes.base },
              ] as const
            ).map((group) => (
              <div key={group.tier} className="space-y-5">
                <h3 className="text-xs uppercase tracking-[0.18em] text-[#C6A66A] pb-3 border-b border-[#F7F4EE]/15">
                  {group.tier}
                </h3>
                <ul className="space-y-4">
                  {group.notes.map((note) => (
                    <li key={note.name}>
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-serif text-xl text-[#F7F4EE]">
                          {note.name}
                        </span>
                        <span className="text-[11px] uppercase tracking-[0.14em] text-[#F7F4EE]/55">
                          {note.origin}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-[#F7F4EE]/70">
                        {note.character}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Longevity & Sillage Calibration */}
          <div className="mt-12 pt-10 border-t border-[#F7F4EE]/15 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <span className="text-[11px] uppercase tracking-[0.18em] text-[#F7F4EE]/60">
                Skin Longevity
              </span>
              <p className="mt-1 font-serif text-2xl text-[#F7F4EE] tabular-nums">
                {product.longevityHours}
              </p>
              <div className="mt-3 flex gap-1.5" aria-label={`Longevity ${product.longevityScore} out of 5`}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <span
                    key={n}
                    className={`h-1.5 flex-1 ${
                      n <= product.longevityScore ? 'bg-[#C6A66A]' : 'bg-[#F7F4EE]/15'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-[0.18em] text-[#F7F4EE]/60">
                Sillage Projection
              </span>
              <p className="mt-1 font-serif text-2xl text-[#F7F4EE]">
                {product.sillageLevel}
              </p>
              <div className="mt-3 flex gap-1.5" aria-label={`Sillage ${product.sillageScore} out of 5`}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <span
                    key={n}
                    className={`h-1.5 flex-1 ${
                      n <= product.sillageScore ? 'bg-[#C6A66A]' : 'bg-[#F7F4EE]/15'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-[0.18em] text-[#F7F4EE]/60">
                Ideal Wearing
              </span>
              <p className="mt-1 font-serif text-2xl text-[#F7F4EE]">
                {product.seasonality}
              </p>
              <p className="mt-2.5 text-xs text-[#F7F4EE]/70">
                Best applied to warm pulse points and natural wool or silk lapels.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section id="pdp-reviews" className="mx-auto max-w-[1440px] px-4 sm:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-[#101010]/10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#C6A66A]">
              Client Impressions
            </p>
            <h2 className="mt-2 font-serif text-3xl text-[#101010] tabular-nums">
              Reviews ({product.reviewCount}) · ★ {product.rating.toFixed(1)}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setShowReviewForm((prev) => !prev)}
            className="h-11 px-6 border border-[#101010] text-xs font-medium uppercase tracking-[0.16em] text-[#101010] hover:bg-[#101010] hover:text-[#F7F4EE] transition-colors self-start sm:self-auto"
          >
            {showReviewForm ? 'Cancel Review' : 'Write a Review'}
          </button>
        </div>

        {revFeedback && (
          <p className="mt-4 text-sm text-[#101010] bg-white border border-[#C6A66A] px-4 py-3">
            {revFeedback}
          </p>
        )}

        {showReviewForm && (
          <form
            onSubmit={handleReviewSubmit}
            className="mt-8 bg-white border border-[#101010]/15 p-6 sm:p-8 space-y-5 max-w-2xl"
          >
            <h3 className="font-serif text-2xl text-[#101010]">
              Share Your Olfactory Impression
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="rev-author"
                  className="block text-[11px] uppercase tracking-[0.14em] text-[#292929]/75 mb-1.5"
                >
                  Full Name
                </label>
                <input
                  id="rev-author"
                  type="text"
                  required
                  value={revAuthor}
                  onChange={(e) => setRevAuthor(e.target.value)}
                  className="w-full h-11 px-3 bg-[#F7F4EE]/40 border border-[#101010]/20 text-sm focus:outline-none focus:border-[#C6A66A]"
                />
              </div>
              <div>
                <label
                  htmlFor="rev-location"
                  className="block text-[11px] uppercase tracking-[0.14em] text-[#292929]/75 mb-1.5"
                >
                  City / Country
                </label>
                <input
                  id="rev-location"
                  type="text"
                  value={revLocation}
                  onChange={(e) => setRevLocation(e.target.value)}
                  placeholder="Paris, France"
                  className="w-full h-11 px-3 bg-[#F7F4EE]/40 border border-[#101010]/20 text-sm focus:outline-none focus:border-[#C6A66A]"
                />
              </div>
            </div>

            <div>
              <span className="block text-[11px] uppercase tracking-[0.14em] text-[#292929]/75 mb-1.5">
                Rating
              </span>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRevRating(star)}
                    aria-label={`${star} stars`}
                    className={`h-10 w-10 flex items-center justify-center border ${
                      revRating >= star
                        ? 'bg-[#101010] text-[#C6A66A] border-[#101010]'
                        : 'bg-white text-[#292929]/40 border-[#101010]/15'
                    }`}
                  >
                    <Star className="w-4 h-4" fill="currentColor" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="rev-title"
                className="block text-[11px] uppercase tracking-[0.14em] text-[#292929]/75 mb-1.5"
              >
                Headline
              </label>
              <input
                id="rev-title"
                type="text"
                required
                value={revTitle}
                onChange={(e) => setRevTitle(e.target.value)}
                className="w-full h-11 px-3 bg-[#F7F4EE]/40 border border-[#101010]/20 text-sm focus:outline-none focus:border-[#C6A66A]"
              />
            </div>

            <div>
              <label
                htmlFor="rev-comment"
                className="block text-[11px] uppercase tracking-[0.14em] text-[#292929]/75 mb-1.5"
              >
                Reflection
              </label>
              <textarea
                id="rev-comment"
                rows={4}
                required
                value={revComment}
                onChange={(e) => setRevComment(e.target.value)}
                className="w-full p-3 bg-[#F7F4EE]/40 border border-[#101010]/20 text-sm focus:outline-none focus:border-[#C6A66A]"
              />
            </div>

            <button
              type="submit"
              disabled={revBusy}
              className="h-11 px-7 bg-[#101010] text-xs uppercase tracking-[0.16em] text-[#F7F4EE] hover:bg-[#292929] disabled:opacity-60"
            >
              {revBusy ? 'Publishing...' : 'Publish Review'}
            </button>
          </form>
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {product.reviews.map((rev) => (
            <article
              key={rev.id}
              className="bg-white border border-[#101010]/10 p-6 space-y-3"
            >
              <div className="flex items-center justify-between text-xs text-[#292929]/65">
                <span className="text-[#C6A66A] tabular-nums">
                  {'★'.repeat(rev.rating)}
                </span>
                <span className="tabular-nums">{rev.date}</span>
              </div>
              <h3 className="font-serif text-xl text-[#101010]">{rev.title}</h3>
              <p className="text-sm leading-relaxed text-[#292929]/85">
                {rev.comment}
              </p>
              <p className="pt-2 border-t border-[#101010]/10 text-xs uppercase tracking-[0.12em] text-[#292929]/70">
                {rev.author} · {rev.location}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Related Creations */}
      <section className="mx-auto max-w-[1440px] px-4 sm:px-8 pt-12 pb-8">
        <div className="mb-10">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#C6A66A]">
            Complementary Pairings
          </p>
          <h2 className="mt-2 font-serif text-3xl text-[#101010]">
            You May Also Adore
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {related.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              isWishlisted={wishlistIds.includes(item.id)}
              onSelectProduct={(slug) => onNavigate({ page: 'product', slug })}
              onQuickView={onQuickView}
              onToggleWishlist={onToggleWishlist}
              onAddToCart={(p, sz) => onAddToCart(p, sz)}
            />
          ))}
        </div>
      </section>

      {/* Mobile Sticky Bottom Buy Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#F7F4EE]/95 backdrop-blur-md border-t border-[#101010]/15 px-4 py-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-serif text-base text-[#101010] truncate">
            {product.name}
          </p>
          <p className="text-xs text-[#292929]/75 tabular-nums">
            {selectedSize} · {formatCurrency(activeSizeOption.price)}
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            onAddToCart(
              product,
              selectedSize,
              engraving.trim() || undefined,
              quantity,
            )
          }
          className="h-11 px-5 bg-[#101010] text-[11px] font-medium uppercase tracking-[0.16em] text-[#F7F4EE] whitespace-nowrap shrink-0"
        >
          Add to Bag
        </button>
      </div>
    </main>
  );
}
