import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Sparkles, Image as ImageIcon, Wand2, ArrowRight, Upload } from 'lucide-react';
import type { AppView, Fragrance } from '../types/fragrance.ts';
import { LuxuryImage } from './LuxuryImage.tsx';

interface AtelierPageProps {
  products: Fragrance[];
  onNavigate: (view: AppView) => void;
}

interface ConsultationResult {
  bespokeTitle: string;
  primarySlug: string;
  layeringSlug: string;
  olfactoryAnalysis: string;
  layeringRitual: string;
  signatureAccord: string[];
}

export function AtelierPage({ products, onNavigate }: AtelierPageProps) {
  // 1. Deep Olfactory Consultation (gemini-4-carbon + ThinkingLevel.HIGH)
  const [brief, setBrief] = useState('');
  const [occasion, setOccasion] = useState('Autumn Black-Tie Evening');
  const [wardrobeNotes, setWardrobeNotes] = useState('');
  const [consultBusy, setConsultBusy] = useState(false);
  const [consultError, setConsultError] = useState<string | null>(null);
  const [consultation, setConsultation] = useState<ConsultationResult | null>(null);

  // 2. Flacon Create & Edit Studio (gemini-nano-banana-2.1)
  const [editPrompt, setEditPrompt] = useState(
    'Restyle this obsidian flacon on wet black slate beside dried saffron threads and soft golden window light',
  );
  const [referenceAssetPath, setReferenceAssetPath] = useState(
    '/src/assets/images/product_noir_eternel_1795192808667.jpg',
  );
  const [uploadedBase64, setUploadedBase64] = useState<string | null>(null);
  const [uploadedMime, setUploadedMime] = useState<string | null>(null);
  const [editBusy, setEditBusy] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);

  // 3. High-Resolution Studio Render (gemini-3-pro-image-preview + 1K / 2K / 4K)
  const [hdPrompt, setHdPrompt] = useState(
    'Faceted smoked-amber crystal extrait de parfum flacon with engraved champagne gold cap on travertine pedestal',
  );
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [hdBusy, setHdBusy] = useState(false);
  const [hdError, setHdError] = useState<string | null>(null);
  const [hdImageUrl, setHdImageUrl] = useState<string | null>(null);

  const handleConsultSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setConsultBusy(true);
    setConsultError(null);
    try {
      const res = await fetch('/api/atelier/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief, occasion, wardrobeNotes }),
      });
      const data = await res.json();
      if (!res.ok) {
        setConsultError(data.error ?? 'Unable to complete consultation.');
      } else {
        setConsultation(data.consultation);
      }
    } catch {
      setConsultError('Network error communicating with the Atelier.');
    } finally {
      setConsultBusy(false);
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      const [, base64] = result.split(',');
      if (base64) {
        setUploadedBase64(base64);
        setUploadedMime(file.type || 'image/jpeg');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEditBusy(true);
    setEditError(null);
    try {
      const res = await fetch('/api/atelier/flacon-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: editPrompt,
          aspectRatio: '4:3',
          referenceImageBase64: uploadedBase64 ?? undefined,
          referenceMimeType: uploadedMime ?? undefined,
          referenceAssetPath: uploadedBase64 ? undefined : referenceAssetPath || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setEditError(data.error ?? 'Unable to render bespoke flacon study.');
      } else {
        setEditedImageUrl(data.imageUrl);
      }
    } catch {
      setEditError('Network error communicating with the Visual Atelier.');
    } finally {
      setEditBusy(false);
    }
  };

  const handleHdSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setHdBusy(true);
    setHdError(null);
    try {
      const res = await fetch('/api/atelier/flacon-hd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: hdPrompt,
          imageSize,
          aspectRatio: '4:3',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setHdError(data.error ?? 'Unable to generate high-resolution render.');
      } else {
        setHdImageUrl(data.imageUrl);
      }
    } catch {
      setHdError('Network error communicating with the High-Resolution Studio.');
    } finally {
      setHdBusy(false);
    }
  };

  const primaryMatch = consultation
    ? products.find((p) => p.slug === consultation.primarySlug)
    : undefined;
  const layeringMatch = consultation
    ? products.find((p) => p.slug === consultation.layeringSlug)
    : undefined;

  return (
    <main className="bg-[#F7F4EE] min-h-screen pb-24">
      <section className="bg-[#101010] text-[#F7F4EE] py-20 border-b border-[#C6A66A]/20">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#C6A66A]">
            Place Vendôme Private Studio
          </p>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-normal tracking-[0.04em]">
            ATELIER SUR MESURE
          </h1>
          <p className="mt-4 text-base text-[#F7F4EE]/80 leading-relaxed">
            Commission an architectural layering consultation or visualize a bespoke flacon and campaign setting directly within our Parisian atelier.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 py-14 space-y-16">
        {/* 1. Deep Olfactory Consultation */}
        <section className="bg-white border border-[#101010]/10 p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#C6A66A]">
              <Sparkles className="w-4 h-4" />
              <span>01. Bespoke Olfactory Architecture</span>
            </div>
            <h2 className="font-serif text-3xl text-[#101010]">
              Master Perfumer Layering Consultation
            </h2>
            <p className="text-sm leading-relaxed text-[#292929]/80">
              Describe a memory, atmosphere, textile, or complex layering desire. Our atelier formulates a considered fragrance pairing and wearing ritual.
            </p>

            <form onSubmit={handleConsultSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="atelier-brief"
                  className="block text-[11px] uppercase tracking-[0.14em] text-[#292929]/75 mb-1.5"
                >
                  Your Olfactory Brief *
                </label>
                <textarea
                  id="atelier-brief"
                  rows={3}
                  required
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  placeholder="e.g. Rain on warm Parisian limestone transitioning into smoked cedar and dark velvet rose for late autumn evenings..."
                  className="w-full p-3 bg-[#F7F4EE]/50 border border-[#101010]/20 text-sm focus:outline-none focus:border-[#C6A66A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="atelier-occasion"
                    className="block text-[11px] uppercase tracking-[0.14em] text-[#292929]/75 mb-1.5"
                  >
                    Occasion / Climate
                  </label>
                  <input
                    id="atelier-occasion"
                    type="text"
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full h-10 px-3 bg-[#F7F4EE]/50 border border-[#101010]/20 text-sm focus:outline-none focus:border-[#C6A66A]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="atelier-notes"
                    className="block text-[11px] uppercase tracking-[0.14em] text-[#292929]/75 mb-1.5"
                  >
                    Favored Notes
                  </label>
                  <input
                    id="atelier-notes"
                    type="text"
                    value={wardrobeNotes}
                    onChange={(e) => setWardrobeNotes(e.target.value)}
                    placeholder="Iris, Oud, Bergamot"
                    className="w-full h-10 px-3 bg-[#F7F4EE]/50 border border-[#101010]/20 text-sm focus:outline-none focus:border-[#C6A66A]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={consultBusy}
                className="h-11 px-7 bg-[#101010] text-xs font-medium uppercase tracking-[0.16em] text-[#F7F4EE] hover:bg-[#292929] disabled:opacity-60"
              >
                {consultBusy ? 'Composing Formula...' : 'Compose Prescription'}
              </button>
            </form>

            {consultError && (
              <p className="p-3.5 bg-amber-50 border border-amber-300 text-xs text-amber-950">
                {consultError}
              </p>
            )}
          </div>

          <div className="lg:col-span-7 bg-[#F7F4EE] border border-[#101010]/10 p-6 sm:p-8 flex flex-col justify-center">
            {!consultation ? (
              <div className="text-center py-10 space-y-3">
                <p className="font-serif text-2xl text-[#101010]">
                  Awaiting Your Olfactory Brief
                </p>
                <p className="text-sm text-[#292929]/70 max-w-md mx-auto">
                  Submit a mood or complex layering request to receive a tailored pairing from the Noira vault.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#C6A66A]">
                    Bespoke Dossier
                  </p>
                  <h3 className="mt-1 font-serif text-3xl text-[#101010]">
                    {consultation.bespokeTitle}
                  </h3>
                </div>

                <p className="text-sm leading-relaxed text-[#292929]/85">
                  {consultation.olfactoryAnalysis}
                </p>

                <div className="p-4 bg-white border border-[#101010]/10">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#292929]/65">
                    Layering Ritual
                  </p>
                  <p className="mt-1.5 text-sm text-[#101010]">
                    {consultation.layeringRitual}
                  </p>
                  <p className="mt-3 text-xs uppercase tracking-[0.14em] text-[#C6A66A]">
                    {consultation.signatureAccord.join(' · ')}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {primaryMatch && (
                    <button
                      type="button"
                      onClick={() =>
                        onNavigate({ page: 'product', slug: primaryMatch.slug })
                      }
                      className="h-10 px-5 bg-[#101010] text-xs uppercase tracking-[0.14em] text-[#F7F4EE] inline-flex items-center gap-2"
                    >
                      <span>View {primaryMatch.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {layeringMatch && layeringMatch.slug !== primaryMatch?.slug && (
                    <button
                      type="button"
                      onClick={() =>
                        onNavigate({ page: 'product', slug: layeringMatch.slug })
                      }
                      className="h-10 px-5 border border-[#101010]/30 text-xs uppercase tracking-[0.14em] text-[#101010]"
                    >
                      Pair with {layeringMatch.name}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 2. Bespoke Flacon Create & Edit Studio */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Create & Edit with Reference */}
          <div className="bg-white border border-[#101010]/10 p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#C6A66A]">
              <Wand2 className="w-4 h-4" />
              <span>02. Flacon Direction &amp; Editing</span>
            </div>
            <h2 className="font-serif text-3xl text-[#101010]">
              Bespoke Flacon Visualizer
            </h2>
            <p className="text-sm text-[#292929]/80">
              Create an original campaign composition or edit an existing Noira flacon with custom lighting, stone plinths, or botanicals.
            </p>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="flacon-ref-select"
                  className="block text-[11px] uppercase tracking-[0.14em] text-[#292929]/75 mb-1.5"
                >
                  Base Flacon Reference
                </label>
                <select
                  id="flacon-ref-select"
                  value={referenceAssetPath}
                  onChange={(e) => {
                    setUploadedBase64(null);
                    setReferenceAssetPath(e.target.value);
                  }}
                  className="w-full h-10 px-3 bg-[#F7F4EE]/50 border border-[#101010]/20 text-sm focus:outline-none focus:border-[#C6A66A]"
                >
                  <option value="">None (Generate from prompt alone)</option>
                  {products.slice(0, 6).map((p) => (
                    <option key={p.id} value={p.images[0]}>
                      {p.name} ({p.concentration})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="flacon-upload"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[#101010] hover:text-[#C6A66A] cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>
                    {uploadedBase64
                      ? 'Custom reference image attached'
                      : 'Or upload your own bottle reference'}
                  </span>
                </label>
                <input
                  id="flacon-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="sr-only"
                />
              </div>

              <div>
                <label
                  htmlFor="flacon-edit-prompt"
                  className="block text-[11px] uppercase tracking-[0.14em] text-[#292929]/75 mb-1.5"
                >
                  Art Direction Prompt
                </label>
                <textarea
                  id="flacon-edit-prompt"
                  rows={3}
                  required
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  className="w-full p-3 bg-[#F7F4EE]/50 border border-[#101010]/20 text-sm focus:outline-none focus:border-[#C6A66A]"
                />
              </div>

              <button
                type="submit"
                disabled={editBusy}
                className="h-11 px-7 bg-[#101010] text-xs font-medium uppercase tracking-[0.16em] text-[#F7F4EE] hover:bg-[#292929] disabled:opacity-60"
              >
                {editBusy ? 'Rendering Study...' : 'Generate / Edit Flacon'}
              </button>
            </form>

            {editError && (
              <p className="p-3.5 bg-amber-50 border border-amber-300 text-xs text-amber-950">
                {editError}
              </p>
            )}

            <div className="aspect-[4/3] bg-[#E9E1D5] border border-[#101010]/10 overflow-hidden">
              <LuxuryImage
                src={editedImageUrl ?? referenceAssetPath}
                alt="Bespoke flacon preview"
                fallbackTitle="Bespoke Flacon Study"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* 3. High-Resolution Campaign Studio (1K / 2K / 4K) */}
          <div className="bg-white border border-[#101010]/10 p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#C6A66A]">
              <ImageIcon className="w-4 h-4" />
              <span>03. High-Resolution Campaign Press</span>
            </div>
            <h2 className="font-serif text-3xl text-[#101010]">
              Editorial Print Studio
            </h2>
            <p className="text-sm text-[#292929]/80">
              Render museum-grade luxury bottle stills at selectable archival resolution (1K, 2K, or 4K).
            </p>

            <form onSubmit={handleHdSubmit} className="space-y-4">
              <div>
                <span className="block text-[11px] uppercase tracking-[0.14em] text-[#292929]/75 mb-2">
                  Output Resolution
                </span>
                <div className="grid grid-cols-3 gap-2.5">
                  {(['1K', '2K', '4K'] as const).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setImageSize(sz)}
                      className={`h-10 border text-xs font-medium tracking-[0.16em] tabular-nums transition-colors ${
                        imageSize === sz
                          ? 'bg-[#101010] text-[#F7F4EE] border-[#101010]'
                          : 'bg-[#F7F4EE]/50 text-[#101010] border-[#101010]/20 hover:border-[#101010]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="hd-campaign-prompt"
                  className="block text-[11px] uppercase tracking-[0.14em] text-[#292929]/75 mb-1.5"
                >
                  Campaign Scene Prompt
                </label>
                <textarea
                  id="hd-campaign-prompt"
                  rows={3}
                  required
                  value={hdPrompt}
                  onChange={(e) => setHdPrompt(e.target.value)}
                  className="w-full p-3 bg-[#F7F4EE]/50 border border-[#101010]/20 text-sm focus:outline-none focus:border-[#C6A66A]"
                />
              </div>

              <button
                type="submit"
                disabled={hdBusy}
                className="h-11 px-7 bg-[#C6A66A] text-[#101010] text-xs font-semibold uppercase tracking-[0.16em] hover:bg-[#101010] hover:text-[#F7F4EE] transition-colors disabled:opacity-60"
              >
                {hdBusy ? `Rendering ${imageSize}...` : `Render ${imageSize} Master`}
              </button>
            </form>

            {hdError && (
              <p className="p-3.5 bg-amber-50 border border-amber-300 text-xs text-amber-950">
                {hdError}
              </p>
            )}

            <div className="aspect-[4/3] bg-[#101010] border border-[#101010]/10 overflow-hidden">
              <LuxuryImage
                src={
                  hdImageUrl ?? '/src/assets/images/collection_exclusive_1795192808676.jpg'
                }
                alt="High-resolution editorial print render"
                fallbackTitle="Editorial Print Render"
                darkSurface
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
