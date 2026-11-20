import type {
  CartItem,
  CatalogFilters,
  CheckoutCustomer,
  Fragrance,
  QuizAnswers,
  SortOption,
} from '../types/fragrance.ts';

export const COMPLIMENTARY_SHIPPING_THRESHOLD = 250;
export const STANDARD_SHIPPING_FEE = 18;
export const ESTIMATED_TAX_RATE = 0.08;

export function getStartingPrice(product: Fragrance): number {
  if (!product.sizes.length) return 0;
  return Math.min(...product.sizes.map((s) => s.price));
}

export function filterFragrances(
  products: Fragrance[],
  filters: CatalogFilters,
): Fragrance[] {
  const query = filters.searchQuery.trim().toLowerCase();

  return products.filter((product) => {
    if (filters.collection !== 'all' && product.collection !== filters.collection) {
      return false;
    }

    if (filters.category !== 'all' && product.category !== filters.category) {
      return false;
    }

    if (filters.family !== 'all' && !product.families.includes(filters.family)) {
      return false;
    }

    if (
      filters.size !== 'all' &&
      !product.sizes.some((option) => option.size === filters.size)
    ) {
      return false;
    }

    const basePrice = getStartingPrice(product);
    if (filters.priceRange === 'under-220' && basePrice >= 220) {
      return false;
    }
    if (filters.priceRange === '220-300' && (basePrice < 220 || basePrice > 300)) {
      return false;
    }
    if (filters.priceRange === 'over-300' && basePrice <= 300) {
      return false;
    }

    if (query) {
      const searchable = [
        product.name,
        product.subtitle,
        product.concentration,
        product.primaryFamily,
        product.shortDescription,
        ...product.families,
        ...product.notes.top.map((n) => n.name),
        ...product.notes.heart.map((n) => n.name),
        ...product.notes.base.map((n) => n.name),
      ]
        .join(' ')
        .toLowerCase();

      if (!searchable.includes(query)) {
        return false;
      }
    }

    return true;
  });
}

export function sortFragrances(
  products: Fragrance[],
  sortBy: SortOption,
): Fragrance[] {
  const list = [...products];
  switch (sortBy) {
    case 'price-asc':
      return list.sort((a, b) => getStartingPrice(a) - getStartingPrice(b));
    case 'price-desc':
      return list.sort((a, b) => getStartingPrice(b) - getStartingPrice(a));
    case 'newest':
      return list.sort((a, b) => {
        const aNew = a.badge === 'New Arrival' ? 1 : 0;
        const bNew = b.badge === 'New Arrival' ? 1 : 0;
        return bNew - aNew;
      });
    case 'rating':
      return list.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    case 'featured':
    default:
      return list;
  }
}

export function calculateCartTotals(
  items: CartItem[],
  deliveryMethod: CheckoutCustomer['deliveryMethod'] = 'complimentary-courier',
): {
  itemCount: number;
  subtotal: number;
  shipping: number;
  remainingForFreeShipping: number;
  tax: number;
  total: number;
} {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = Number(
    items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2),
  );

  if (subtotal === 0) {
    return {
      itemCount: 0,
      subtotal: 0,
      shipping: 0,
      remainingForFreeShipping: COMPLIMENTARY_SHIPPING_THRESHOLD,
      tax: 0,
      total: 0,
    };
  }

  const qualifiesForComplimentary = subtotal >= COMPLIMENTARY_SHIPPING_THRESHOLD;
  const shipping =
    deliveryMethod === 'boutique-collection' || qualifiesForComplimentary
      ? 0
      : STANDARD_SHIPPING_FEE;
  const remainingForFreeShipping = Math.max(
    0,
    Number((COMPLIMENTARY_SHIPPING_THRESHOLD - subtotal).toFixed(2)),
  );
  const tax = Number((subtotal * ESTIMATED_TAX_RATE).toFixed(2));
  const total = Number((subtotal + shipping + tax).toFixed(2));

  return {
    itemCount,
    subtotal,
    shipping,
    remainingForFreeShipping,
    tax,
    total,
  };
}

export function validateCheckoutForm(
  customer: CheckoutCustomer,
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!customer.firstName.trim()) {
    errors.firstName = 'First name is required.';
  }
  if (!customer.lastName.trim()) {
    errors.lastName = 'Last name is required.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }
  if (customer.phone.trim().replace(/[^0-9+]/g, '').length < 7) {
    errors.phone = 'Enter a valid telephone number for courier updates.';
  }
  if (customer.deliveryMethod !== 'boutique-collection') {
    if (!customer.address.trim()) {
      errors.address = 'Street address is required.';
    }
    if (!customer.city.trim()) {
      errors.city = 'City is required.';
    }
    if (!customer.postalCode.trim()) {
      errors.postalCode = 'Postal code is required.';
    }
    if (!customer.country.trim()) {
      errors.country = 'Country is required.';
    }
  }

  return errors;
}

export function recommendFragrancesFromQuiz(
  products: Fragrance[],
  answers: QuizAnswers,
): Fragrance[] {
  const nonGiftProducts = products.filter((p) => !p.isGift);

  const scored = nonGiftProducts.map((product) => {
    let score = 0;

    if (product.primaryFamily === answers.preferredFamily) {
      score += 5;
    } else if (product.families.includes(answers.preferredFamily)) {
      score += 3;
    }

    if (answers.intensity === 'commanding' && product.longevityScore >= 5) {
      score += 3;
    } else if (answers.intensity === 'intimate' && product.sillageScore <= 3) {
      score += 3;
    } else if (answers.intensity === 'balanced' && product.sillageScore === 4) {
      score += 3;
    }

    if (
      answers.mood === 'nocturnal' &&
      (product.collection === 'exclusive' ||
        product.families.includes('Oriental') ||
        product.families.includes('Woody'))
    ) {
      score += 2;
    }
    if (
      answers.mood === 'radiant' &&
      (product.families.includes('Citrus') || product.families.includes('Fresh'))
    ) {
      score += 2;
    }
    if (
      answers.mood === 'velvet' &&
      (product.families.includes('Floral') || product.families.includes('Amber'))
    ) {
      score += 2;
    }
    if (
      answers.mood === 'botanical' &&
      (product.families.includes('Fresh') || product.families.includes('Woody'))
    ) {
      score += 2;
    }

    if (answers.occasion === 'evening' && product.concentration.includes('Extrait')) {
      score += 2;
    }
    if (answers.occasion === 'daily' && product.sillageScore <= 4) {
      score += 1;
    }

    return { product, score };
  });

  scored.sort((a, b) => b.score - a.score || b.product.rating - a.product.rating);
  return scored.slice(0, 3).map((item) => item.product);
}

export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}
