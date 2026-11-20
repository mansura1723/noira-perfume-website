import type { AppView } from '../types/fragrance.ts';
import { LuxuryImage } from './LuxuryImage.tsx';

interface StoryPageProps {
  onNavigate: (view: AppView) => void;
}

export function StoryPage({ onNavigate }: StoryPageProps) {
  return (
    <main className="bg-[#F7F4EE]">
      <section className="relative bg-[#101010] text-[#F7F4EE] py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <LuxuryImage
            src="/src/assets/images/atelier_craftsmanship_1795192808946.jpg"
            alt="Maison Noira master perfumer organ in Paris"
            fallbackTitle="Maison Noira Heritage"
            darkSurface
            className="w-full h-full object-cover opacity-50"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#101010] via-[#101010]/55 to-transparent"
            aria-hidden="true"
          />
        </div>
        <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-8 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.24em] text-[#C6A66A]">
            The Heritage · Paris &amp; Grasse
          </p>
          <h1 className="mt-4 font-serif text-4xl sm:text-6xl font-normal tracking-[0.03em] [text-wrap:balance]">
            ARCHITECTURAL PERFUMERY IN SHADOW AND LIGHT
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 sm:px-8 py-20 sm:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 space-y-3">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#C6A66A]">
            01. Philosophy
          </p>
          <h2 className="font-serif text-3xl text-[#101010]">
            Sculpted for Presence, Not Spectacle
          </h2>
        </div>
        <div className="lg:col-span-8 space-y-6 text-base leading-relaxed text-[#292929]/85">
          <p>
            Founded in Paris at Place Vendôme, Maison Noira approaches fine fragrance as invisible architecture. Where fleeting trends chase loud sweetness, our perfumers compose with chiaroscuro—pairing incandescent citrus or rose harvests against obsidian woods, aged resins, and cool iris butter.
          </p>
          <p>
            Every raw material is traced directly to its terroir: Centifolia petals gathered before sunrise in Grasse, rhizomes of Iris Pallida cured for thirty-six months in Florence, and sustainably harvested agarwood distilled in small copper alembics.
          </p>
        </div>
      </section>

      <section className="bg-white border-y border-[#101010]/10 py-20">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.18em] text-[#C6A66A] tabular-nums">
              180 Days
            </span>
            <h3 className="font-serif text-2xl text-[#101010]">
              Slow Obsidian Maceration
            </h3>
            <p className="text-sm leading-relaxed text-[#292929]/80">
              Each extrait rests in light-shielded vats for six months before filtration so volatile top accords fuse seamlessly into the resinous base.
            </p>
          </div>
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.18em] text-[#C6A66A] tabular-nums">
              28% – 36%
            </span>
            <h3 className="font-serif text-2xl text-[#101010]">
              Extrait Concentration
            </h3>
            <p className="text-sm leading-relaxed text-[#292929]/80">
              High oil density engineered for effortless twelve-hour evolution on skin without harsh synthetic projection.
            </p>
          </div>
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.18em] text-[#C6A66A]">
              Refillable Crystal
            </span>
            <h3 className="font-serif text-2xl text-[#101010]">
              Heirloom Flacon Craft
            </h3>
            <p className="text-sm leading-relaxed text-[#292929]/80">
              Weighted French glass crowned with hand-brushed brass caps designed to remain on your dressing table for decades.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 sm:px-8 py-20 text-center space-y-6">
        <h2 className="font-serif text-3xl sm:text-4xl text-[#101010]">
          Compose Your Personal Signature
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            type="button"
            onClick={() => onNavigate({ page: 'collections', initialCollection: 'all' })}
            className="h-12 px-8 bg-[#101010] text-xs uppercase tracking-[0.18em] text-[#F7F4EE] hover:bg-[#292929]"
          >
            Explore Fragrances
          </button>
          <button
            type="button"
            onClick={() => onNavigate({ page: 'atelier' })}
            className="h-12 px-8 border border-[#101010] text-xs uppercase tracking-[0.18em] text-[#101010] hover:bg-[#101010] hover:text-[#F7F4EE]"
          >
            Enter Atelier Sur Mesure
          </button>
        </div>
      </section>
    </main>
  );
}
