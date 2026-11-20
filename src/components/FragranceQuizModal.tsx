import { useState } from 'react';
import { X, ArrowRight, RotateCcw, ShoppingBag } from 'lucide-react';
import type {
  BottleSizeLabel,
  Fragrance,
  FragranceFamily,
  QuizAnswers,
} from '../types/fragrance.ts';
import { formatCurrency, getStartingPrice, recommendFragrancesFromQuiz } from '../utils/commerce.ts';
import { LuxuryImage } from './LuxuryImage.tsx';

interface FragranceQuizModalProps {
  isOpen: boolean;
  products: Fragrance[];
  onClose: () => void;
  onSelectProduct: (slug: string) => void;
  onAddToCart: (product: Fragrance, size: BottleSizeLabel) => void;
}

const FAMILIES: FragranceFamily[] = [
  'Floral',
  'Woody',
  'Oriental',
  'Fresh',
  'Citrus',
  'Amber',
  'Gourmand',
];

export function FragranceQuizModal({
  isOpen,
  products,
  onClose,
  onSelectProduct,
  onAddToCart,
}: FragranceQuizModalProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({
    mood: 'nocturnal',
    preferredFamily: 'Oriental',
    intensity: 'commanding',
    occasion: 'evening',
  });

  if (!isOpen) return null;

  const recommendations = recommendFragrancesFromQuiz(products, answers);

  const reset = () => {
    setStep(0);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#101010]/75 backdrop-blur-[2px] p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Fragrance Discovery Quiz"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-3xl bg-[#F7F4EE] border border-[#101010]/15 shadow-2xl p-6 sm:p-10 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close fragrance quiz"
          className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center text-[#101010] hover:text-[#C6A66A]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="border-b border-[#101010]/10 pb-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#C6A66A]">
            Olfactory Portrait · Step {Math.min(step + 1, 4)} of 4
          </p>
          <h2 className="mt-1.5 font-serif text-3xl text-[#101010]">
            {step < 4 ? 'Discover Your Signature Presence' : 'Your Curated Wardrobe'}
          </h2>
        </div>

        {step === 0 && (
          <div className="mt-8 space-y-6">
            <h3 className="font-serif text-2xl text-[#101010]">
              01. Which atmosphere speaks most deeply to you?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(
                [
                  {
                    value: 'nocturnal',
                    title: 'Nocturnal Velvet',
                    desc: 'Candlelit marble, smoked woods, and understated midnight allure.',
                  },
                  {
                    value: 'radiant',
                    title: 'Sunlit Limestone',
                    desc: 'Crisp morning citrus, mineral air, and translucent silk.',
                  },
                  {
                    value: 'velvet',
                    title: 'Opulent Salon',
                    desc: 'Crimson rose petals, golden saffron, and warm skin amber.',
                  },
                  {
                    value: 'botanical',
                    title: 'Atelier Herbarium',
                    desc: 'White tea infusions, raw cedar bark, and calm meditative woods.',
                  },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setAnswers((prev) => ({ ...prev, mood: opt.value }));
                    setStep(1);
                  }}
                  className={`p-5 text-left border transition-colors ${
                    answers.mood === opt.value
                      ? 'border-[#101010] bg-white'
                      : 'border-[#101010]/15 bg-white/70 hover:border-[#C6A66A]'
                  }`}
                >
                  <span className="block font-serif text-xl text-[#101010]">
                    {opt.title}
                  </span>
                  <span className="mt-1.5 block text-xs leading-relaxed text-[#292929]/75">
                    {opt.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="mt-8 space-y-6">
            <h3 className="font-serif text-2xl text-[#101010]">
              02. Select your primary olfactory family
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {FAMILIES.map((family) => (
                <button
                  key={family}
                  type="button"
                  onClick={() => {
                    setAnswers((prev) => ({ ...prev, preferredFamily: family }));
                    setStep(2);
                  }}
                  className={`h-14 px-4 border text-xs uppercase tracking-[0.16em] transition-colors ${
                    answers.preferredFamily === family
                      ? 'bg-[#101010] text-[#F7F4EE] border-[#101010]'
                      : 'bg-white text-[#101010] border-[#101010]/15 hover:border-[#C6A66A]'
                  }`}
                >
                  {family}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setStep(0)}
              className="text-xs uppercase tracking-[0.14em] text-[#292929]/70 hover:text-[#101010]"
            >
              Back to Step 1
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="mt-8 space-y-6">
            <h3 className="font-serif text-2xl text-[#101010]">
              03. Choose your desired trail &amp; sillage
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(
                [
                  {
                    value: 'intimate',
                    title: 'Intimate Veil',
                    desc: 'Close-to-skin radiance noticed only in quiet proximity.',
                  },
                  {
                    value: 'balanced',
                    title: 'Poised Presence',
                    desc: 'Refined architectural trail calibrated from morning to dusk.',
                  },
                  {
                    value: 'commanding',
                    title: 'Commanding Extrait',
                    desc: 'High-concentration depth lingering across hours and textiles.',
                  },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setAnswers((prev) => ({ ...prev, intensity: opt.value }));
                    setStep(3);
                  }}
                  className="p-5 text-left bg-white border border-[#101010]/15 hover:border-[#C6A66A] transition-colors"
                >
                  <span className="block font-serif text-xl text-[#101010]">
                    {opt.title}
                  </span>
                  <span className="mt-1.5 block text-xs leading-relaxed text-[#292929]/75">
                    {opt.desc}
                  </span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs uppercase tracking-[0.14em] text-[#292929]/70 hover:text-[#101010]"
            >
              Back to Step 2
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="mt-8 space-y-6">
            <h3 className="font-serif text-2xl text-[#101010]">
              04. When will this fragrance accompany you most?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(
                [
                  { value: 'daily', title: 'Daily Tailoring', desc: 'Crisp, composed poise from studio to gallery.' },
                  { value: 'evening', title: 'After Dusk', desc: 'Black tie, candlelit dining, and nocturnal warmth.' },
                  { value: 'signature', title: 'All-Season Emblem', desc: 'An unmistakable personal signature worn year-round.' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setAnswers((prev) => ({ ...prev, occasion: opt.value }));
                    setStep(4);
                  }}
                  className="p-5 text-left bg-white border border-[#101010]/15 hover:border-[#C6A66A] transition-colors"
                >
                  <span className="block font-serif text-xl text-[#101010]">
                    {opt.title}
                  </span>
                  <span className="mt-1.5 block text-xs leading-relaxed text-[#292929]/75">
                    {opt.desc}
                  </span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-xs uppercase tracking-[0.14em] text-[#292929]/70 hover:text-[#101010]"
            >
              Back to Step 3
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="mt-8 space-y-6">
            <p className="text-sm text-[#292929]/80">
              Tailored to your affinity for <strong className="font-medium text-[#101010]">{answers.preferredFamily}</strong> accords and <strong className="font-medium text-[#101010]">{answers.intensity}</strong> projection:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {recommendations.map((item) => {
                const defaultSize =
                  item.sizes.find((s) => s.size === '50ml')?.size ?? item.sizes[0].size;
                return (
                  <div
                    key={item.id}
                    className="bg-white border border-[#101010]/10 flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-[4/3] bg-[#E9E1D5] overflow-hidden">
                        <LuxuryImage
                          src={item.images[0]}
                          alt={item.name}
                          fallbackTitle={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-[#C6A66A]">
                          {item.primaryFamily} · {item.concentration}
                        </p>
                        <h4 className="mt-1 font-serif text-xl text-[#101010]">
                          {item.name}
                        </h4>
                        <p className="mt-1.5 text-xs text-[#292929]/75 line-clamp-2">
                          {item.shortDescription}
                        </p>
                        <p className="mt-2 text-sm font-medium tabular-nums">
                          From {formatCurrency(getStartingPrice(item))}
                        </p>
                      </div>
                    </div>
                    <div className="p-4 pt-0 space-y-2">
                      <button
                        type="button"
                        onClick={() => {
                          onAddToCart(item, defaultSize);
                          onClose();
                        }}
                        className="w-full h-10 bg-[#101010] text-[11px] uppercase tracking-[0.14em] text-[#F7F4EE] hover:bg-[#292929] inline-flex items-center justify-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add {defaultSize}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onSelectProduct(item.slug);
                        }}
                        className="w-full h-9 text-[11px] uppercase tracking-[0.14em] text-[#101010] hover:text-[#C6A66A] inline-flex items-center justify-center gap-1"
                      >
                        <span>Explore Notes</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-[#101010]/10">
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-[#292929] hover:text-[#101010]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Consultation</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 border border-[#101010]/20 text-xs uppercase tracking-[0.14em] text-[#101010] hover:border-[#101010]"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
