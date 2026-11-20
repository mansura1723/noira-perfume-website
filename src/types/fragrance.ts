export type FragranceFamily =
  | 'Floral'
  | 'Woody'
  | 'Oriental'
  | 'Fresh'
  | 'Citrus'
  | 'Amber'
  | 'Gourmand';

export type FragranceCategory = 'For Her' | 'For Him' | 'Unisex';

export type CollectionKey =
  | 'all'
  | 'feminine'
  | 'masculine'
  | 'signature'
  | 'exclusive'
  | 'gifts';

export type BottleSizeLabel = '30ml' | '50ml' | '100ml' | 'Coffret';

export interface FragranceSizeOption {
  size: BottleSizeLabel;
  price: number;
  stock: number;
  sku: string;
}

export interface OlfactoryNote {
  name: string;
  origin: string;
  character: string;
}

export interface OlfactoryPyramid {
  top: OlfactoryNote[];
  heart: OlfactoryNote[];
  base: OlfactoryNote[];
}

export interface ProductReview {
  id: string;
  author: string;
  location: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
}

export interface Fragrance {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  concentration: string;
  category: FragranceCategory;
  collection: Exclude<CollectionKey, 'all'>;
  families: FragranceFamily[];
  primaryFamily: FragranceFamily;
  badge?: 'Bestseller' | 'New Arrival' | 'Exclusive' | 'Gift Edition';
  shortDescription: string;
  editorialStory: string;
  images: string[];
  sizes: FragranceSizeOption[];
  notes: OlfactoryPyramid;
  longevityHours: string;
  longevityScore: number; // 1 to 5
  sillageLevel: string;
  sillageScore: number; // 1 to 5
  seasonality: string;
  ingredients: string;
  rating: number;
  reviewCount: number;
  reviews: ProductReview[];
  isGift?: boolean;
  engravable?: boolean;
}

export interface CollectionMeta {
  key: Exclude<CollectionKey, 'all'>;
  title: string;
  kicker: string;
  description: string;
  editorialQuote: string;
  image: string;
}

export interface CartItem {
  key: string; // productId::size::engraving
  productId: string;
  slug: string;
  name: string;
  concentration: string;
  image: string;
  size: BottleSizeLabel;
  price: number;
  quantity: number;
  engraving?: string;
}

export type SortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'newest'
  | 'rating';

export type PriceRangeFilter = 'all' | 'under-220' | '220-300' | 'over-300';

export interface CatalogFilters {
  collection: CollectionKey;
  category: 'all' | FragranceCategory;
  family: 'all' | FragranceFamily;
  size: 'all' | BottleSizeLabel;
  priceRange: PriceRangeFilter;
  searchQuery: string;
}

export interface CheckoutCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  postalCode: string;
  country: string;
  giftMessage?: string;
  deliveryMethod: 'complimentary-courier' | 'boutique-collection' | 'cash-on-delivery';
}

export interface OrderRecord {
  id: string;
  createdAt: string;
  status: 'Confirmed' | 'Preparing in Atelier' | 'Dispatched';
  customer: CheckoutCustomer;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface QuizAnswers {
  mood: 'nocturnal' | 'radiant' | 'velvet' | 'botanical';
  preferredFamily: FragranceFamily;
  intensity: 'intimate' | 'balanced' | 'commanding';
  occasion: 'evening' | 'daily' | 'signature';
}

export type AppView =
  | { page: 'home' }
  | { page: 'collections'; initialCollection?: CollectionKey; initialFamily?: FragranceFamily | 'all' }
  | { page: 'product'; slug: string }
  | { page: 'checkout' }
  | { page: 'confirmation'; orderId: string }
  | { page: 'story' }
  | { page: 'atelier' };
