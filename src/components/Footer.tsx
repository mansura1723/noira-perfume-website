import { useState, type FormEvent } from 'react';
import { ArrowUp, X } from 'lucide-react';
import type { AppView, CollectionKey } from '../types/fragrance.ts';

interface FooterProps {
  onNavigate: (view: AppView) => void;
  onSubscribeNewsletter: (email: string) => Promise<{ ok: boolean; message: string }>;
}

type LegalTopic = 'shipping' | 'privacy' | 'terms' | 'concierge' | null;

const LEGAL_COPY: Record<Exclude<LegalTopic, null>, { title: string; body: string[] }> = {
  shipping: {
    title: 'Complimentary Delivery & Returns',
    body: [
      'Every Maison Noira creation is prepared in temperature-controlled Parisian coffrets and dispatched with tracked express courier delivery. Orders exceeding $250 receive complimentary express shipping worldwide.',
      'Each full-size flacon includes two complimentary discovery vials so you may experience the fragrance on skin before unsealing the outer ribbon. Unopened flacons in original sealed packaging may be returned within 30 days of delivery.',
    ],
  },
  privacy: {
    title: 'Client Privacy Charter',
    body: [
      'Maison Noira respects the confidentiality of every client dossier. Shipping coordinates, monogram preferences, and order archives are used strictly to fulfill your boutique requests and private atelier consultations.',
      'We never sell, rent, or trade client contact details with external marketing brokers.',
    ],
  },
  terms: {
    title: 'Terms & Conditions of Sale',
    body: [
      'All extraits de parfum and collector editions are produced in small macerated batches and remain subject to seasonal botanical availability. Engraved flacons and bespoke coffrets are personalized to order and final upon confirmation.',
    ],
  },
  concierge: {
    title: 'Maison Concierge & Boutiques',
    body: [
      'Flagship Salon: 24 Place Vendôme, 75001 Paris · Monday – Saturday, 10:30 – 19:30 CET.',
      'Private Client Concierge: concierge@noira-parfums.example · Dedicated assistance for bespoke gifting, engraving, and olfactory layering.',
    ],
  },
};

export function Footer({ onNavigate, onSubscribeNewsletter }: FooterProps) {
  const [email, setEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [legalModal, setLegalModal] = useState<LegalTopic>(null);

  const goCollection = (collection: CollectionKey) => {
    onNavigate({ page: 'collections', initialCollection: collection });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    setStatusMessage(null);
    const result = await onSubscribeNewsletter(email.trim());
    setIsError(!result.ok);
    setStatusMessage(result.message);
    if (result.ok) {
      setEmail('');
    }
    setSubmitting(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#101010] text-[#F7F4EE] border-t border-[#C6A66A]/20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-[#F7F4EE]/10">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-5">
            <span className="font-serif text-3xl tracking-[0.28em] uppercase text-[#F7F4EE] block">
              NOIRA
            </span>
            <p className="text-sm leading-relaxed text-[#F7F4EE]/70 max-w-sm">
              Parisian haute parfumerie dedicated to architectural extraits, rare botanical absolutes, and the quiet permanence of scent.
            </p>
            <p className="text-xs tracking-[0.16em] uppercase text-[#C6A66A]">
              24 Place Vendôme · Paris
            </p>
          </div>

          {/* Shop Categories */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-[11px] uppercase tracking-[0.18em] text-[#C6A66A]">
              Creations
            </h3>
            <ul className="space-y-2.5 text-sm text-[#F7F4EE]/75">
              <li>
                <button
                  type="button"
                  onClick={() => goCollection('all')}
                  className="hover:text-[#C6A66A] transition-colors"
                >
                  All Fragrances
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => goCollection('feminine')}
                  className="hover:text-[#C6A66A] transition-colors"
                >
                  The Feminine Collection
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => goCollection('masculine')}
                  className="hover:text-[#C6A66A] transition-colors"
                >
                  The Masculine Collection
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => goCollection('exclusive')}
                  className="hover:text-[#C6A66A] transition-colors"
                >
                  Exclusive Extraits
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => goCollection('gifts')}
                  className="hover:text-[#C6A66A] transition-colors"
                >
                  Gift Coffrets
                </button>
              </li>
            </ul>
          </div>

          {/* Maison & Client Service */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-[11px] uppercase tracking-[0.18em] text-[#C6A66A]">
              Client Care
            </h3>
            <ul className="space-y-2.5 text-sm text-[#F7F4EE]/75">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: 'story' })}
                  className="hover:text-[#C6A66A] transition-colors"
                >
                  Our Story
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: 'atelier' })}
                  className="hover:text-[#C6A66A] transition-colors"
                >
                  Atelier Sur Mesure
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setLegalModal('shipping')}
                  className="hover:text-[#C6A66A] transition-colors"
                >
                  Shipping &amp; Returns
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setLegalModal('concierge')}
                  className="hover:text-[#C6A66A] transition-colors"
                >
                  Boutique Concierge
                </button>
              </li>
            </ul>
          </div>

          {/* Footer Newsletter */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="text-[11px] uppercase tracking-[0.18em] text-[#C6A66A]">
              Private Invitations
            </h3>
            <p className="text-sm text-[#F7F4EE]/70">
              Receive early access to numbered vintage harvests and Parisian salon previews.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <label htmlFor="footer-newsletter-email" className="sr-only">
                Email address for newsletter
              </label>
              <input
                id="footer-newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 h-11 px-4 bg-[#292929]/70 border border-[#F7F4EE]/20 text-sm text-[#F7F4EE] placeholder:text-[#F7F4EE]/45 focus:outline-none focus:border-[#C6A66A]"
              />
              <button
                type="submit"
                disabled={submitting}
                className="h-11 px-5 bg-[#C6A66A] text-[#101010] text-xs font-medium tracking-[0.16em] uppercase hover:bg-[#F7F4EE] transition-colors whitespace-nowrap disabled:opacity-60"
              >
                {submitting ? 'Joining...' : 'Join'}
              </button>
            </form>
            {statusMessage && (
              <p
                className={`text-xs ${
                  isError ? 'text-rose-300' : 'text-[#C6A66A]'
                }`}
              >
                {statusMessage}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Legal & Back to Top Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#F7F4EE]/60">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>© 2026 Maison Noira Paris. All rights reserved.</span>
            <button
              type="button"
              onClick={() => setLegalModal('privacy')}
              className="hover:text-[#F7F4EE] transition-colors"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => setLegalModal('terms')}
              className="hover:text-[#F7F4EE] transition-colors"
            >
              Terms &amp; Conditions
            </button>
            <button
              type="button"
              onClick={() => setLegalModal('concierge')}
              className="hover:text-[#F7F4EE] transition-colors"
            >
              Instagram · Editorial Journal
            </button>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#C6A66A] hover:text-[#F7F4EE] transition-colors"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Policy / Concierge Modal */}
      {legalModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#101010]/75 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={LEGAL_COPY[legalModal].title}
        >
          <div
            className="absolute inset-0"
            onClick={() => setLegalModal(null)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-lg bg-[#F7F4EE] text-[#101010] p-8 border border-[#101010]/15 shadow-2xl">
            <button
              type="button"
              onClick={() => setLegalModal(null)}
              aria-label="Close dialog"
              className="absolute top-4 right-4 p-2 text-[#101010] hover:text-[#C6A66A]"
            >
              <X className="w-5 h-5" />
            </button>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#C6A66A]">
              Maison Noira Charter
            </p>
            <h3 className="mt-2 font-serif text-3xl text-[#101010]">
              {LEGAL_COPY[legalModal].title}
            </h3>
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-[#292929]/85">
              {LEGAL_COPY[legalModal].body.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
