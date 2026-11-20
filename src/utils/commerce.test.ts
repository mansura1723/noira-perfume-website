import test from 'node:test';
import assert from 'node:assert/strict';
import { FRAGRANCES } from '../data/catalog.ts';
import {
  calculateCartTotals,
  filterFragrances,
  recommendFragrancesFromQuiz,
  sortFragrances,
  validateCheckoutForm,
} from './commerce.ts';

test('filterFragrances filters by olfactory family and search query', () => {
  const oriental = filterFragrances(FRAGRANCES, {
    collection: 'all',
    category: 'all',
    family: 'Oriental',
    size: 'all',
    priceRange: 'all',
    searchQuery: '',
  });
  assert.ok(oriental.length >= 3);
  assert.ok(oriental.every((item) => item.families.includes('Oriental')));

  const irisSearch = filterFragrances(FRAGRANCES, {
    collection: 'all',
    category: 'all',
    family: 'all',
    size: 'all',
    priceRange: 'all',
    searchQuery: 'iris',
  });
  assert.ok(irisSearch.some((item) => item.slug === 'noir-eternel'));
});

test('sortFragrances sorts ascending and descending by starting price', () => {
  const asc = sortFragrances(FRAGRANCES, 'price-asc');
  const desc = sortFragrances(FRAGRANCES, 'price-desc');
  assert.ok(asc[0].sizes[0].price <= asc[asc.length - 1].sizes[0].price);
  assert.ok(desc[0].sizes[0].price >= desc[desc.length - 1].sizes[0].price);
});

test('calculateCartTotals applies complimentary shipping above $250 threshold', () => {
  const belowThreshold = calculateCartTotals([
    {
      key: 'velvet-rose::30ml::',
      productId: 'velvet-rose',
      slug: 'velvet-rose',
      name: 'VELVET ROSE',
      concentration: 'Eau de Parfum',
      image: '/src/assets/images/product_velvet_rose_1795192808364.jpg',
      size: '30ml',
      price: 165,
      quantity: 1,
    },
  ]);
  assert.equal(belowThreshold.subtotal, 165);
  assert.equal(belowThreshold.shipping, 18);
  assert.equal(belowThreshold.remainingForFreeShipping, 85);

  const aboveThreshold = calculateCartTotals([
    {
      key: 'noir-eternel::100ml::',
      productId: 'noir-eternel',
      slug: 'noir-eternel',
      name: 'NOIR ÉTERNEL',
      concentration: 'Extrait de Parfum',
      image: '/src/assets/images/product_noir_eternel_1795192808667.jpg',
      size: '100ml',
      price: 340,
      quantity: 1,
    },
  ]);
  assert.equal(aboveThreshold.shipping, 0);
  assert.equal(aboveThreshold.remainingForFreeShipping, 0);
  assert.equal(aboveThreshold.tax, 27.2);
  assert.equal(aboveThreshold.total, 367.2);
});

test('validateCheckoutForm enforces required customer and shipping fields', () => {
  const invalidErrors = validateCheckoutForm({
    firstName: '',
    lastName: 'Laurent',
    email: 'invalid-email',
    phone: '123',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    deliveryMethod: 'complimentary-courier',
  });
  assert.ok(invalidErrors.firstName);
  assert.ok(invalidErrors.email);
  assert.ok(invalidErrors.phone);
  assert.ok(invalidErrors.address);

  const boutiqueValid = validateCheckoutForm({
    firstName: 'Camille',
    lastName: 'Laurent',
    email: 'camille@noira.paris',
    phone: '+33142685500',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    deliveryMethod: 'boutique-collection',
  });
  assert.deepEqual(boutiqueValid, {});
});

test('recommendFragrancesFromQuiz returns 3 distinct non-gift recommendations', () => {
  const recs = recommendFragrancesFromQuiz(FRAGRANCES, {
    mood: 'nocturnal',
    preferredFamily: 'Woody',
    intensity: 'commanding',
    occasion: 'evening',
  });
  assert.equal(recs.length, 3);
  assert.ok(recs.every((item) => !item.isGift));
  assert.ok(
    recs.some((item) => item.slug === 'midnight-oud' || item.slug === 'noir-eternel'),
  );
});
