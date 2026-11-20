import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import { FRAGRANCES } from './src/data/catalog.ts';
import { calculateCartTotals, validateCheckoutForm } from './src/utils/commerce.ts';
import type {
  CartItem,
  CheckoutCustomer,
  Fragrance,
  OrderRecord,
  ProductReview,
} from './src/types/fragrance.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = path.resolve(__dirname, 'data');
const STORE_PATH = path.resolve(DATA_DIR, 'store.json');

interface StoreState {
  products: Fragrance[];
  orders: OrderRecord[];
  newsletter: string[];
}

function loadStore(): StoreState {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, 'utf-8');
      const parsed = JSON.parse(raw) as Partial<StoreState>;
      return {
        products:
          Array.isArray(parsed.products) && parsed.products.length > 0
            ? parsed.products
            : structuredClone(FRAGRANCES),
        orders: Array.isArray(parsed.orders) ? parsed.orders : [],
        newsletter: Array.isArray(parsed.newsletter) ? parsed.newsletter : [],
      };
    }
  } catch {
    // Fall back to deterministic seed state if store.json is unreadable.
  }

  return {
    products: structuredClone(FRAGRANCES),
    orders: [
      {
        id: 'NR-1041',
        createdAt: '2026-11-12T14:22:00.000Z',
        status: 'Dispatched',
        customer: {
          firstName: 'Camille',
          lastName: 'Laurent',
          email: 'camille.laurent@example.com',
          phone: '+33142685500',
          address: '14 Rue Saint-Honoré',
          city: 'Paris',
          postalCode: '75001',
          country: 'France',
          deliveryMethod: 'complimentary-courier',
        },
        items: [
          {
            key: 'noir-eternel::100ml::CL',
            productId: 'noir-eternel',
            slug: 'noir-eternel',
            name: 'NOIR ÉTERNEL',
            concentration: 'Extrait de Parfum',
            image: '/src/assets/images/product_noir_eternel_1795192808667.jpg',
            size: '100ml',
            price: 340,
            quantity: 1,
            engraving: 'CL',
          },
        ],
        subtotal: 340,
        shipping: 0,
        tax: 27.2,
        total: 367.2,
      },
    ],
    newsletter: [],
  };
}

function saveStore(state: StoreState): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(state, null, 2), 'utf-8');
  } catch {
    // Non-fatal in read-only environments
  }
}

const store: StoreState = loadStore();

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY is not configured. Please add your key in Settings > Secrets.',
    );
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function formatGeminiError(err: unknown): { status: number; message: string } {
  const rawMessage =
    err instanceof Error ? err.message : 'Unexpected Atelier service error.';
  if (rawMessage.includes('GEMINI_API_KEY')) {
    return { status: 400, message: rawMessage };
  }
  if (rawMessage.includes('PERMISSION_DENIED') || rawMessage.includes('403')) {
    return {
      status: 403,
      message:
        'This Atelier studio model requires a billing-enabled API key in Settings > Secrets.',
    };
  }
  if (rawMessage.includes('RESOURCE_EXHAUSTED') || rawMessage.includes('429')) {
    return {
      status: 429,
      message:
        'Atelier capacity limit reached or paid-tier key required in Settings > Secrets.',
    };
  }
  if (rawMessage.includes('API_KEY_INVALID') || rawMessage.includes('400')) {
    return {
      status: 400,
      message: 'API key appears invalid. Please verify it in Settings > Secrets.',
    };
  }
  return { status: 500, message: rawMessage };
}

async function createServer() {
  const app = express();
  app.use(express.json({ limit: '15mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', maison: 'NOIRA' });
  });

  app.get('/api/products', (_req, res) => {
    res.json({ products: store.products });
  });

  app.get('/api/orders', (_req, res) => {
    res.json({ orders: store.orders });
  });

  app.post('/api/orders', (req, res) => {
    const body = req.body as {
      customer?: CheckoutCustomer;
      items?: CartItem[];
    };

    if (!body.customer || !Array.isArray(body.items) || body.items.length === 0) {
      res.status(400).json({ error: 'Customer details and at least one item are required.' });
      return;
    }

    const errors = validateCheckoutForm(body.customer);
    if (Object.keys(errors).length > 0) {
      res.status(400).json({ error: 'Please complete all required checkout fields.', fields: errors });
      return;
    }

    // Recompute authoritative item prices from catalog
    const verifiedItems: CartItem[] = [];
    for (const reqItem of body.items) {
      const product = store.products.find((p) => p.id === reqItem.productId);
      if (!product) {
        res.status(400).json({ error: `Fragrance "${reqItem.name}" is unavailable.` });
        return;
      }
      const sizeOption = product.sizes.find((s) => s.size === reqItem.size);
      if (!sizeOption) {
        res.status(400).json({ error: `Size ${reqItem.size} is unavailable for ${product.name}.` });
        return;
      }
      const qty = Math.max(1, Math.min(10, Math.floor(reqItem.quantity || 1)));
      verifiedItems.push({
        key: reqItem.key,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        concentration: product.concentration,
        image: product.images[0],
        size: sizeOption.size,
        price: sizeOption.price,
        quantity: qty,
        engraving: reqItem.engraving ? reqItem.engraving.slice(0, 3).toUpperCase() : undefined,
      });

      if (sizeOption.stock >= qty) {
        sizeOption.stock -= qty;
      }
    }

    const totals = calculateCartTotals(verifiedItems, body.customer.deliveryMethod);
    const orderNumber = `NR-${1042 + store.orders.length}`;
    const order: OrderRecord = {
      id: orderNumber,
      createdAt: new Date().toISOString(),
      status: 'Confirmed',
      customer: body.customer,
      items: verifiedItems,
      subtotal: totals.subtotal,
      shipping: totals.shipping,
      tax: totals.tax,
      total: totals.total,
    };

    store.orders.unshift(order);
    saveStore(store);

    res.status(201).json({ order });
  });

  app.post('/api/reviews/:productId', (req, res) => {
    const { productId } = req.params;
    const product = store.products.find((p) => p.id === productId);
    if (!product) {
      res.status(404).json({ error: 'Fragrance not found.' });
      return;
    }

    const { author, location, rating, title, comment } = req.body as {
      author?: string;
      location?: string;
      rating?: number;
      title?: string;
      comment?: string;
    };

    if (!author?.trim() || !title?.trim() || !comment?.trim()) {
      res.status(400).json({ error: 'Name, headline, and review reflection are required.' });
      return;
    }

    const clampedRating = Math.max(1, Math.min(5, Math.round(Number(rating) || 5)));
    const newReview: ProductReview = {
      id: `rev-${Date.now()}`,
      author: author.trim(),
      location: location?.trim() || 'Paris, France',
      rating: clampedRating,
      title: title.trim(),
      comment: comment.trim(),
      date: new Date().toISOString().slice(0, 10),
      verified: true,
    };

    product.reviews.unshift(newReview);
    product.reviewCount += 1;
    const avg =
      product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;
    product.rating = Number(avg.toFixed(1));
    saveStore(store);

    res.status(201).json({ review: newReview, product });
  });

  app.post('/api/newsletter', (req, res) => {
    const { email } = req.body as { email?: string };
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      res.status(400).json({ error: 'Please provide a valid email address.' });
      return;
    }
    const normalized = email.trim().toLowerCase();
    if (!store.newsletter.includes(normalized)) {
      store.newsletter.push(normalized);
      saveStore(store);
    }
    res.status(201).json({
      subscribed: true,
      message: 'Welcome to the Private Circle of Maison Noira.',
    });
  });

  // High-Thinking Bespoke Olfactory Architecture Consultation (gemini-4-carbon)
  app.post('/api/atelier/consult', async (req, res) => {
    try {
      const { brief, wardrobeNotes, occasion } = req.body as {
        brief?: string;
        wardrobeNotes?: string;
        occasion?: string;
      };

      if (!brief?.trim()) {
        res.status(400).json({ error: 'Please describe your desired mood, memories, or scent preferences.' });
        return;
      }

      const ai = getGeminiClient();
      const catalogContext = store.products
        .map(
          (p) =>
            `${p.name} (${p.slug}, ${p.concentration}, Primary: ${p.primaryFamily}, Notes: ${[
              ...p.notes.top.map((n) => n.name),
              ...p.notes.heart.map((n) => n.name),
              ...p.notes.base.map((n) => n.name),
            ].join(', ')})`,
        )
        .join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-4-carbon',
        contents: `Client Olfactory Brief: ${brief.trim()}
Preferred Occasion / Climate: ${occasion?.trim() || 'Evening & Architectural Presence'}
Current Wardrobe / Favorite Notes: ${wardrobeNotes?.trim() || 'Open to rare woods, iris, and resinous amber'}

Available NOIRA Creations:
${catalogContext}`,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
          systemInstruction:
            'You are the Master Perfumer and Creative Director of Maison Noira in Paris. Compose an understated, deeply considered bespoke fragrance consultation. Never mention AI or technology. Recommend a primary NOIRA fragrance (using its exact slug from the list) and a secondary layering pairing if helpful, explain the top/heart/base evolution on skin, and suggest a bespoke ritual.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              bespokeTitle: { type: Type.STRING },
              primarySlug: { type: Type.STRING },
              layeringSlug: { type: Type.STRING },
              olfactoryAnalysis: { type: Type.STRING },
              layeringRitual: { type: Type.STRING },
              signatureAccord: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: [
              'bespokeTitle',
              'primarySlug',
              'layeringSlug',
              'olfactoryAnalysis',
              'layeringRitual',
              'signatureAccord',
            ],
          },
        },
      });

      const text = (response.text ?? '{}').trim();
      const parsed = JSON.parse(text);
      res.json({ consultation: parsed });
    } catch (err) {
      const formatted = formatGeminiError(err);
      res.status(formatted.status).json({ error: formatted.message });
    }
  });

  // Bespoke Flacon Creation & Editing (gemini-nano-banana-2.1)
  app.post('/api/atelier/flacon-create', async (req, res) => {
    try {
      const { prompt, aspectRatio, referenceImageBase64, referenceMimeType, referenceAssetPath } =
        req.body as {
          prompt?: string;
          aspectRatio?: string;
          referenceImageBase64?: string;
          referenceMimeType?: string;
          referenceAssetPath?: string;
        };

      if (!prompt?.trim()) {
        res.status(400).json({ error: 'Please provide an art direction prompt for your flacon.' });
        return;
      }

      const ai = getGeminiClient();
      const parts: Array<{ text?: string; inlineData?: { data: string; mimeType: string } }> = [];

      if (referenceImageBase64 && referenceMimeType) {
        parts.push({
          inlineData: {
            data: referenceImageBase64,
            mimeType: referenceMimeType,
          },
        });
      } else if (referenceAssetPath && referenceAssetPath.startsWith('/src/assets/images/')) {
        const resolved = path.resolve(__dirname, referenceAssetPath.slice(1));
        if (fs.existsSync(resolved)) {
          const buffer = fs.readFileSync(resolved);
          parts.push({
            inlineData: {
              data: buffer.toString('base64'),
              mimeType: 'image/jpeg',
            },
          });
        }
      }

      parts.push({
        text: `Haute parfumerie studio direction for Maison Noira: ${prompt.trim()}. Obsidian black, champagne gold, and warm travertine stone palette, dramatic studio lighting, ultra-refined editorial luxury photography.`,
      });

      const response = await ai.models.generateContent({
        model: 'gemini-nano-banana-2.1',
        contents: { parts },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio || '4:3',
          },
        },
      });

      let imageUrl: string | undefined;
      let notes = '';
      for (const part of response.candidates?.[0]?.content?.parts ?? []) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType ?? 'image/png';
          imageUrl = `data:${mime};base64,${part.inlineData.data}`;
        } else if (part.text) {
          notes += part.text;
        }
      }

      if (!imageUrl) {
        res.status(502).json({ error: 'No image was returned by the studio model.' });
        return;
      }

      res.json({ imageUrl, notes: notes.trim() });
    } catch (err) {
      const formatted = formatGeminiError(err);
      res.status(formatted.status).json({ error: formatted.message });
    }
  });

  // High-Resolution Studio Render with 1K / 2K / 4K Size (gemini-3-pro-image-preview)
  app.post('/api/atelier/flacon-hd', async (req, res) => {
    try {
      const { prompt, imageSize, aspectRatio } = req.body as {
        prompt?: string;
        imageSize?: '1K' | '2K' | '4K';
        aspectRatio?: string;
      };

      if (!prompt?.trim()) {
        res.status(400).json({ error: 'Please describe the high-resolution campaign scene.' });
        return;
      }

      const validSize = imageSize === '2K' || imageSize === '4K' ? imageSize : '1K';
      const ai = getGeminiClient();

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [
            {
              text: `Parisian luxury perfume editorial campaign for Maison Noira: ${prompt.trim()}. Architectural glass flacon, Nero Marquina marble, warm champagne gold reflections, museum-grade studio lighting.`,
            },
          ],
        },
        config: {
          imageConfig: {
            imageSize: validSize,
            aspectRatio: aspectRatio || '4:3',
          },
        },
      });

      let imageUrl: string | undefined;
      let notes = '';
      for (const part of response.candidates?.[0]?.content?.parts ?? []) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType ?? 'image/png';
          imageUrl = `data:${mime};base64,${part.inlineData.data}`;
        } else if (part.text) {
          notes += part.text;
        }
      }

      if (!imageUrl) {
        res.status(502).json({ error: 'No high-resolution render was returned.' });
        return;
      }

      res.json({ imageUrl, imageSize: validSize, notes: notes.trim() });
    } catch (err) {
      const formatted = formatGeminiError(err);
      res.status(formatted.status).json({ error: formatted.message });
    }
  });

  if (process.env.NODE_ENV === 'production') {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distDir, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NOIRA Haute Parfumerie server listening on http://localhost:${PORT}`);
  });
}

createServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
