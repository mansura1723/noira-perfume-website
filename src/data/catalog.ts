import type { CollectionMeta, Fragrance, FragranceFamily } from '../types/fragrance.ts';

export const OLFACTORY_FAMILIES: {
  family: FragranceFamily;
  summary: string;
  keyNotes: string;
}[] = [
  {
    family: 'Floral',
    summary: 'Opulent petals harvested at dawn in Grasse, balanced with cool iris butter.',
    keyNotes: 'Centifolia Rose · Iris Pallida · Night Jasmine',
  },
  {
    family: 'Woody',
    summary: 'Architectural cedarwood, aged Mysore sandalwood, and smoked vetiver roots.',
    keyNotes: 'Atlas Cedar · Vetiver · Smoked Birch',
  },
  {
    family: 'Oriental',
    summary: 'Resinous depth woven from sacred labdanum, saffron threads, and dark oud.',
    keyNotes: 'Assam Oud · Saffron · Myrrh',
  },
  {
    family: 'Fresh',
    summary: 'Crisp mineral clarity inspired by limestone courtyards after morning rain.',
    keyNotes: 'White Tea · Neroli · Mineral Accord',
  },
  {
    family: 'Citrus',
    summary: 'Sun-drenched Calabrian bergamot and bitter petitgrain pressed from green rind.',
    keyNotes: 'Bergamot · Mandarin Zest · Petitgrain',
  },
  {
    family: 'Amber',
    summary: 'Luminous warmth of golden benzoin tears, cistus resin, and aged tonka.',
    keyNotes: 'Siam Benzoin · Labdanum · Ambergris Accord',
  },
  {
    family: 'Gourmand',
    summary: 'Restrained nocturnal sweetness of roasted cacao, Madagascar vanilla, and rum.',
    keyNotes: 'Black Vanilla · Roasted Tonka · Spiced Honey',
  },
];

export const COLLECTIONS: CollectionMeta[] = [
  {
    key: 'feminine',
    title: 'THE FEMININE COLLECTION',
    kicker: 'Poised Radiance',
    description:
      'Luminous florals sculpted with cool iris, velvety Damask rose, and warm skin-hugging musks.',
    editorialQuote: 'Grace that lingers in the threshold long after departure.',
    image: '/src/assets/images/collection_feminine_1795192808336.jpg',
  },
  {
    key: 'masculine',
    title: 'THE MASCULINE COLLECTION',
    kicker: 'Architectural Shadow',
    description:
      'Charred woods, smoked leather, and resinous oud distilled for composed, effortless authority.',
    editorialQuote: 'Tailored intensity carved in obsidian glass and brushed brass.',
    image: '/src/assets/images/collection_masculine_1795192808160.jpg',
  },
  {
    key: 'signature',
    title: 'THE SIGNATURE COLLECTION',
    kicker: 'House Icons',
    description:
      'Our foundational genderless creations balancing luminous citruses against deep amber warmth.',
    editorialQuote: 'Timeless compositions conceived without boundary or season.',
    image: '/src/assets/images/collection_signature_1795192808269.jpg',
  },
  {
    key: 'exclusive',
    title: 'THE EXCLUSIVE COLLECTION',
    kicker: 'Haute Concentration',
    description:
      'Small-batch extraits macerated for six months in dark crystal using rare vintage harvests.',
    editorialQuote: 'Numbered collector flacons of uncompromising olfactory depth.',
    image: '/src/assets/images/collection_exclusive_1795192808676.jpg',
  },
];

export const FRAGRANCES: Fragrance[] = [
  {
    id: 'noir-eternel',
    slug: 'noir-eternel',
    name: 'NOIR ÉTERNEL',
    subtitle: 'Smoked Iris · Black Cardamom · Aged Cedar',
    concentration: 'Extrait de Parfum',
    category: 'For Him',
    collection: 'signature',
    families: ['Oriental', 'Woody', 'Amber'],
    primaryFamily: 'Oriental',
    badge: 'Bestseller',
    shortDescription:
      'An obsidian veil of Florentine iris butter, crushed black cardamom, and smoked Atlas cedar.',
    editorialStory:
      'Composed as the nocturnal emblem of Maison Noira, Noir Éternel opens with electric black pepper and cold cardamom before settling into powdery iris and warm benzoin resin. Designed for evening tailoring and unhurried presence.',
    images: [
      '/src/assets/images/product_noir_eternel_1795192808667.jpg',
      '/src/assets/images/hero_noira_campaign_1795192808642.jpg',
      '/src/assets/images/campaign_scent_remains_1795192808469.jpg',
    ],
    sizes: [
      { size: '30ml', price: 185, stock: 24, sku: 'NR-NE-030' },
      { size: '50ml', price: 255, stock: 18, sku: 'NR-NE-050' },
      { size: '100ml', price: 340, stock: 14, sku: 'NR-NE-100' },
    ],
    notes: {
      top: [
        { name: 'Black Cardamom', origin: 'Guatemala', character: 'Smoky, aromatic spice' },
        { name: 'Calabrian Bergamot', origin: 'Italy', character: 'Crisp dark citrus lift' },
        { name: 'Pink Peppercorn', origin: 'Réunion', character: 'Sparkling dry warmth' },
      ],
      heart: [
        { name: 'Iris Pallida Butter', origin: 'Florence', character: 'Cool, powdery suede' },
        { name: 'Black Tea Accord', origin: 'Yunnan', character: 'Tannic, velvet depth' },
        { name: 'Violet Leaf', origin: 'Egypt', character: 'Crisp green mineral edge' },
      ],
      base: [
        { name: 'Atlas Cedarwood', origin: 'Morocco', character: 'Dry architectural wood' },
        { name: 'Siam Benzoin', origin: 'Laos', character: 'Balsamic amber glow' },
        { name: 'Haitian Vetiver', origin: 'Haiti', character: 'Earthy smoky trail' },
      ],
    },
    longevityHours: '10–12 Hours',
    longevityScore: 5,
    sillageLevel: 'Commanding & Refined',
    sillageScore: 4,
    seasonality: 'Autumn · Winter · Evening',
    ingredients:
      'Alcohol Denat., Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Coumarin, Alpha-Isomethyl Ionone, Citral, Eugenol.',
    rating: 4.9,
    reviewCount: 142,
    engravable: true,
    reviews: [
      {
        id: 'rev-ne-1',
        author: 'Camille Laurent',
        location: 'Paris, France',
        rating: 5,
        title: 'Pure velvet sophistication',
        comment:
          'The iris and cardamom opening is breathtaking. On wool coats it lasts well past midnight without ever feeling heavy.',
        date: '2026-10-14',
        verified: true,
      },
      {
        id: 'rev-ne-2',
        author: 'Julian Vance',
        location: 'London, UK',
        rating: 5,
        title: 'My permanent evening signature',
        comment:
          'Unmistakably luxurious. The obsidian flacon sits like a piece of sculpture on my dresser.',
        date: '2026-09-28',
        verified: true,
      },
    ],
  },
  {
    id: 'velvet-rose',
    slug: 'velvet-rose',
    name: 'VELVET ROSE',
    subtitle: 'Centifolia Rose · Pink Saffron · Cashmere Amber',
    concentration: 'Eau de Parfum',
    category: 'For Her',
    collection: 'feminine',
    families: ['Floral', 'Amber'],
    primaryFamily: 'Floral',
    badge: 'Bestseller',
    shortDescription:
      'Lush Grasse rose petals wrapped in golden saffron threads, cashmere wood, and warm musk.',
    editorialStory:
      'Far from an innocent garden floral, Velvet Rose captures the flower at twilight—petals bruised with spiced saffron and anchored in luminous white ambergris.',
    images: [
      '/src/assets/images/product_velvet_rose_1795192808364.jpg',
      '/src/assets/images/collection_feminine_1795192808336.jpg',
      '/src/assets/images/gift_coffret_atelier_1795192807870.jpg',
    ],
    sizes: [
      { size: '30ml', price: 165, stock: 30, sku: 'NR-VR-030' },
      { size: '50ml', price: 230, stock: 22, sku: 'NR-VR-050' },
      { size: '100ml', price: 310, stock: 16, sku: 'NR-VR-100' },
    ],
    notes: {
      top: [
        { name: 'Red Saffron', origin: 'Spain', character: 'Luminous leathery spice' },
        { name: 'Blood Mandarin', origin: 'Sicily', character: 'Sunlit nectar brightness' },
        { name: 'White Peach', origin: 'Provence', character: 'Delicate skin softness' },
      ],
      heart: [
        { name: 'Rose Centifolia', origin: 'Grasse', character: 'Honeyed, lush floral core' },
        { name: 'Peony Silk', origin: 'France', character: 'Airy petal radiance' },
        { name: 'Geranium Bourbon', origin: 'Madagascar', character: 'Crisp rosy lift' },
      ],
      base: [
        { name: 'Cashmere Wood', origin: 'Atelier Accord', character: 'Soft enveloping warmth' },
        { name: 'Ambrette Seed', origin: 'Peru', character: 'Sensual skin musk' },
        { name: 'Labdanum Resin', origin: 'Andalusia', character: 'Golden amber anchor' },
      ],
    },
    longevityHours: '8–10 Hours',
    longevityScore: 4,
    sillageLevel: 'Enveloping Silk',
    sillageScore: 4,
    seasonality: 'All Seasons · Day to Night',
    ingredients:
      'Alcohol Denat., Parfum (Fragrance), Aqua (Water), Citronellol, Geraniol, Linalool, Limonene, Eugenol, Farnesol.',
    rating: 4.9,
    reviewCount: 118,
    engravable: true,
    reviews: [
      {
        id: 'rev-vr-1',
        author: 'Éléonore Moreau',
        location: 'Lyon, France',
        rating: 5,
        title: 'Modern, warm, unforgettable',
        comment:
          'Usually rose scents lean vintage, but Velvet Rose feels architectural and intensely sensual against warm cashmere.',
        date: '2026-10-22',
        verified: true,
      },
    ],
  },
  {
    id: 'golden-ember',
    slug: 'golden-ember',
    name: 'GOLDEN EMBER',
    subtitle: 'Cognac Resin · Black Vanilla · Roasted Tonka',
    concentration: 'Eau de Parfum Intense',
    category: 'Unisex',
    collection: 'signature',
    families: ['Amber', 'Gourmand', 'Oriental'],
    primaryFamily: 'Amber',
    badge: 'New Arrival',
    shortDescription:
      'Molten cognac amber, dark Madagascar vanilla bean, and toasted Venezuelan tonka.',
    editorialStory:
      'Inspired by embers glowing inside a Parisian salon, Golden Ember balances dry aged oak barrels with spiced honeyed resin and dark, unsweetened vanilla.',
    images: [
      '/src/assets/images/product_golden_ember_1795192808259.jpg',
      '/src/assets/images/collection_signature_1795192808269.jpg',
      '/src/assets/images/atelier_craftsmanship_1795192808946.jpg',
    ],
    sizes: [
      { size: '30ml', price: 175, stock: 20, sku: 'NR-GE-030' },
      { size: '50ml', price: 245, stock: 15, sku: 'NR-GE-050' },
      { size: '100ml', price: 325, stock: 11, sku: 'NR-GE-100' },
    ],
    notes: {
      top: [
        { name: 'Ceylon Cinnamon', origin: 'Sri Lanka', character: 'Warm dry bark spice' },
        { name: 'Bitter Orange Peel', origin: 'Seville', character: 'Zesty golden contrast' },
        { name: 'Nutmeg Blossom', origin: 'Indonesia', character: 'Velvety spice haze' },
      ],
      heart: [
        { name: 'Cognac Oak', origin: 'Charente', character: 'Intoxicating barrel warmth' },
        { name: 'Myrrh Tears', origin: 'Somalia', character: 'Smoky resinous depth' },
        { name: 'Cacao Nib', origin: 'Ecuador', character: 'Dry roasted richness' },
      ],
      base: [
        { name: 'Black Vanilla Pod', origin: 'Madagascar', character: 'Dark balsamic sweetness' },
        { name: 'Roasted Tonka Bean', origin: 'Venezuela', character: 'Creamy almond trail' },
        { name: 'Golden Ambergris', origin: 'Atelier Accord', character: 'Luminous mineral musk' },
      ],
    },
    longevityHours: '10–14 Hours',
    longevityScore: 5,
    sillageLevel: 'Radiant & Intoxicating',
    sillageScore: 5,
    seasonality: 'Autumn · Winter',
    ingredients:
      'Alcohol Denat., Parfum (Fragrance), Aqua (Water), Coumarin, Cinnamal, Limonene, Eugenol, Linalool, Benzyl Benzoate.',
    rating: 4.8,
    reviewCount: 89,
    engravable: true,
    reviews: [
      {
        id: 'rev-ge-1',
        author: 'Henrik Lindqvist',
        location: 'Stockholm, Sweden',
        rating: 5,
        title: 'Gourmand done with haute restraint',
        comment:
          'Never cloying. The oak and cacao notes keep the vanilla sharp, smoky, and extraordinarily polished.',
        date: '2026-11-02',
        verified: true,
      },
    ],
  },
  {
    id: 'midnight-oud',
    slug: 'midnight-oud',
    name: 'MIDNIGHT OUD',
    subtitle: 'Smoked Agarwood · Black Leather · Incense',
    concentration: 'Extrait de Parfum',
    category: 'For Him',
    collection: 'masculine',
    families: ['Woody', 'Oriental'],
    primaryFamily: 'Woody',
    badge: 'Bestseller',
    shortDescription:
      'Rare aged agarwood charred over sacred frankincense, supple black leather, and patchouli.',
    editorialStory:
      'Distilled in small numbered batches, Midnight Oud pairs resinous Assam agarwood with smoky Omani olibanum for an unmistakably commanding nocturnal signature.',
    images: [
      '/src/assets/images/product_midnight_oud_1795192808171.jpg',
      '/src/assets/images/collection_masculine_1795192808160.jpg',
      '/src/assets/images/campaign_scent_remains_1795192808469.jpg',
    ],
    sizes: [
      { size: '30ml', price: 210, stock: 12, sku: 'NR-MO-030' },
      { size: '50ml', price: 295, stock: 10, sku: 'NR-MO-050' },
      { size: '100ml', price: 390, stock: 7, sku: 'NR-MO-100' },
    ],
    notes: {
      top: [
        { name: 'Black Pepper', origin: 'Madagascar', character: 'Sharp mineral heat' },
        { name: 'Elemi Resin', origin: 'Philippines', character: 'Incense citrus sparkle' },
        { name: 'Juniper Berry', origin: 'Tuscany', character: 'Crisp resinous edge' },
      ],
      heart: [
        { name: 'Omani Frankincense', origin: 'Dhofar', character: 'Sacred cathedral smoke' },
        { name: 'Saffron Leather', origin: 'Atelier Accord', character: 'Supple dark suede' },
        { name: 'Turkish Rose', origin: 'Isparta', character: 'Shadowed floral velvet' },
      ],
      base: [
        { name: 'Aged Assam Oud', origin: 'India', character: 'Deep woody complexity' },
        { name: 'Dark Patchouli', origin: 'Indonesia', character: 'Earthy nocturnal earth' },
        { name: 'Smoked Birch', origin: 'Nordics', character: 'Charred amber wood' },
      ],
    },
    longevityHours: '12+ Hours',
    longevityScore: 5,
    sillageLevel: 'Commanding Architecture',
    sillageScore: 5,
    seasonality: 'Evening · Cold Weather',
    ingredients:
      'Alcohol Denat., Parfum (Fragrance), Aqua (Water), Limonene, Eugenol, Citronellol, Linalool, Geraniol.',
    rating: 4.9,
    reviewCount: 96,
    engravable: true,
    reviews: [
      {
        id: 'rev-mo-1',
        author: 'Sébastien Girard',
        location: 'Geneva, Switzerland',
        rating: 5,
        title: 'Museum-grade oud',
        comment:
          'Balanced, dry, and deeply smoky without barnyard harshness. Receives compliments every time I wear evening black tie.',
        date: '2026-10-08',
        verified: true,
      },
    ],
  },
  {
    id: 'blanc-absolu',
    slug: 'blanc-absolu',
    name: 'BLANC ABSOLU',
    subtitle: 'White Neroli · Mineral Tea · Clean Sandalwood',
    concentration: 'Eau de Parfum',
    category: 'Unisex',
    collection: 'signature',
    families: ['Fresh', 'Citrus', 'Floral'],
    primaryFamily: 'Fresh',
    badge: 'New Arrival',
    shortDescription:
      'Luminous Tunisian neroli, crisp white tea steam, and creamy Mysore sandalwood.',
    editorialStory:
      'An olfactory study in pale limestone and morning light. Blanc Absolu captures sheer linen against warm skin with sparkling citrus rind and meditative sandalwood.',
    images: [
      '/src/assets/images/product_blanc_absolu_1795192808733.jpg',
      '/src/assets/images/collection_signature_1795192808269.jpg',
      '/src/assets/images/atelier_craftsmanship_1795192808946.jpg',
    ],
    sizes: [
      { size: '30ml', price: 155, stock: 26, sku: 'NR-BA-030' },
      { size: '50ml', price: 215, stock: 21, sku: 'NR-BA-050' },
      { size: '100ml', price: 290, stock: 19, sku: 'NR-BA-100' },
    ],
    notes: {
      top: [
        { name: 'Petitgrain Citronnier', origin: 'Tunisia', character: 'Crisp crushed leaf' },
        { name: 'White Bergamot', origin: 'Calabria', character: 'Radiant sunlit zest' },
        { name: 'Aldehydic Mist', origin: 'Atelier Accord', character: 'Cool mineral air' },
      ],
      heart: [
        { name: 'White Tea Leaf', origin: 'Fujian', character: 'Serene airy infusion' },
        { name: 'Orange Blossom', origin: 'Morocco', character: 'Honeyed white petal' },
        { name: 'Orris Root', origin: 'Italy', character: 'Chalky stone elegance' },
      ],
      base: [
        { name: 'Creamy Sandalwood', origin: 'Australia', character: 'Milky pale timber' },
        { name: 'White Cedar', origin: 'Virginia', character: 'Clean dry finish' },
        { name: 'Silk Musk', origin: 'Atelier Accord', character: 'Second-skin softness' },
      ],
    },
    longevityHours: '7–9 Hours',
    longevityScore: 4,
    sillageLevel: 'Intimate & Radiant',
    sillageScore: 3,
    seasonality: 'Spring · Summer · Daily Wear',
    ingredients:
      'Alcohol Denat., Parfum (Fragrance), Aqua (Water), Linalool, Limonene, Geraniol, Citral, Farnesol.',
    rating: 4.8,
    reviewCount: 74,
    engravable: true,
    reviews: [
      {
        id: 'rev-ba-1',
        author: 'Claire Dubois',
        location: 'Paris, France',
        rating: 5,
        title: 'Effortless daytime luxury',
        comment:
          'Feels like crisp ivory silk on warm skin. The white tea and sandalwood dry-down is extraordinary.',
        date: '2026-10-30',
        verified: true,
      },
    ],
  },
  {
    id: 'rose-imperiale',
    slug: 'rose-imperiale',
    name: 'ROSE IMPÉRIALE',
    subtitle: 'Crimson Damask · Blackcurrant · Patchouli',
    concentration: 'Extrait de Parfum',
    category: 'For Her',
    collection: 'exclusive',
    families: ['Floral', 'Oriental', 'Amber'],
    primaryFamily: 'Floral',
    badge: 'Exclusive',
    shortDescription:
      'An opulent chypre extrait of dark Damask rose, crushed blackcurrant bud, and aged patchouli.',
    editorialStory:
      'Housed in our collector crystal flacon, Rose Impériale reimagines classic French chypre architecture with deep ruby warmth, wild berry tartness, and velvety oakmoss.',
    images: [
      '/src/assets/images/product_rose_imperiale_1795192808469.jpg',
      '/src/assets/images/collection_exclusive_1795192808676.jpg',
      '/src/assets/images/collection_feminine_1795192808336.jpg',
    ],
    sizes: [
      { size: '30ml', price: 225, stock: 9, sku: 'NR-RI-030' },
      { size: '50ml', price: 315, stock: 8, sku: 'NR-RI-050' },
      { size: '100ml', price: 420, stock: 5, sku: 'NR-RI-100' },
    ],
    notes: {
      top: [
        { name: 'Blackcurrant Bud', origin: 'Burgundy', character: 'Tart crimson brilliance' },
        { name: 'Mandarin Essence', origin: 'Italy', character: 'Bright jewel-toned lift' },
        { name: 'Clove Bud', origin: 'Zanzibar', character: 'Dark spicy contrast' },
      ],
      heart: [
        { name: 'Damask Rose Absolute', origin: 'Bulgaria', character: 'Opulent dark crimson' },
        { name: 'Night-Blooming Jasmine', origin: 'India', character: 'Narcotic floral cream' },
        { name: 'Plum Nectar', origin: 'France', character: 'Velvety fruit shadow' },
      ],
      base: [
        { name: 'Aged Patchouli Heart', origin: 'Sumatra', character: 'Clean dark chypre wood' },
        { name: 'Oakmoss', origin: 'Balkans', character: 'Aristocratic forest floor' },
        { name: 'Labdanum Amber', origin: 'Spain', character: 'Warm balsamic persistence' },
      ],
    },
    longevityHours: '12+ Hours',
    longevityScore: 5,
    sillageLevel: 'Grand & Theatrical',
    sillageScore: 5,
    seasonality: 'Evening · Special Occasions',
    ingredients:
      'Alcohol Denat., Parfum (Fragrance), Aqua (Water), Citronellol, Geraniol, Eugenol, Limonene, Linalool, Evernia Prunastri Extract.',
    rating: 5.0,
    reviewCount: 64,
    engravable: true,
    reviews: [
      {
        id: 'rev-ri-1',
        author: 'Margaux Delacroix',
        location: 'Brussels, Belgium',
        rating: 5,
        title: 'A true haute couture extrait',
        comment:
          'Rich, dark, and regal. One spray fills the evening with Damask rose and patchouli without ever overpowering.',
        date: '2026-11-05',
        verified: true,
      },
    ],
  },
  {
    id: 'l-aube-doree',
    slug: 'l-aube-doree',
    name: "L'AUBE DORÉE",
    subtitle: 'Amalfi Citron · White Jasmine · Golden Amber',
    concentration: 'Eau de Parfum',
    category: 'For Her',
    collection: 'feminine',
    families: ['Citrus', 'Fresh', 'Floral'],
    primaryFamily: 'Citrus',
    shortDescription:
      'Sunlit Amalfi citron and sparkling verbena draped over jasmine sambac and warm golden musk.',
    editorialStory:
      'Created to capture first light across Parisian limestone balconies, L’Aube Dorée pairs vibrant Italian citrus with sheer jasmine tea and gilded skin warmth.',
    images: [
      '/src/assets/images/collection_feminine_1795192808336.jpg',
      '/src/assets/images/product_blanc_absolu_1795192808733.jpg',
    ],
    sizes: [
      { size: '30ml', price: 150, stock: 22, sku: 'NR-AD-030' },
      { size: '50ml', price: 210, stock: 16, sku: 'NR-AD-050' },
      { size: '100ml', price: 280, stock: 12, sku: 'NR-AD-100' },
    ],
    notes: {
      top: [
        { name: 'Amalfi Citron', origin: 'Italy', character: 'Crisp sunlit zest' },
        { name: 'Lemon Verbena', origin: 'Provence', character: 'Verdant sparkling herb' },
        { name: 'White Grapefruit', origin: 'Corsica', character: 'Bitter-bright lift' },
      ],
      heart: [
        { name: 'Jasmine Sambac', origin: 'Grasse', character: 'Dewy floral luminescence' },
        { name: 'Mimosa Blossom', origin: 'Côte d’Azur', character: 'Powdery golden honey' },
        { name: 'Green Fig', origin: 'Mediterranean', character: 'Milky botanical depth' },
      ],
      base: [
        { name: 'White Amber', origin: 'Atelier Accord', character: 'Luminous skin warmth' },
        { name: 'Blonde Cedar', origin: 'France', character: 'Sun-bleached timber' },
        { name: 'Ambrette Musk', origin: 'Ecuador', character: 'Clean lingering veil' },
      ],
    },
    longevityHours: '7–8 Hours',
    longevityScore: 4,
    sillageLevel: 'Airy & Luminous',
    sillageScore: 3,
    seasonality: 'Spring · Summer',
    ingredients:
      'Alcohol Denat., Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Citral, Geraniol.',
    rating: 4.8,
    reviewCount: 52,
    engravable: true,
    reviews: [
      {
        id: 'rev-ad-1',
        author: 'Sofia Rossi',
        location: 'Milan, Italy',
        rating: 5,
        title: 'Sunshine bottled in crystal',
        comment:
          'Bright, refined citrus that never turns sharp or soapy. The mimosa and white amber dry-down is sublime.',
        date: '2026-10-18',
        verified: true,
      },
    ],
  },
  {
    id: 'coffret-noir-eternel',
    slug: 'coffret-noir-eternel',
    name: 'LE COFFRET NOIR ÉTERNEL',
    subtitle: '100ml Flacon · 15ml Travel Atomizer · Silk Presentation',
    concentration: 'Collector Gift Coffret',
    category: 'Unisex',
    collection: 'gifts',
    families: ['Oriental', 'Woody', 'Amber'],
    primaryFamily: 'Oriental',
    badge: 'Gift Edition',
    shortDescription:
      'Our flagship Noir Éternel 100ml flacon paired with a brushed brass 15ml travel atomizer in satin-lined obsidian coffret.',
    editorialStory:
      'Designed for milestone gifting, each Coffret Noir Éternel is hand-assembled in Paris with ivory silk lining, complimentary wax-sealed message card, and bespoke brass engraving.',
    images: [
      '/src/assets/images/gift_coffret_atelier_1795192807870.jpg',
      '/src/assets/images/product_noir_eternel_1795192808667.jpg',
    ],
    sizes: [
      { size: 'Coffret', price: 395, stock: 10, sku: 'NR-GFT-001' },
    ],
    notes: {
      top: [
        { name: 'Black Cardamom', origin: 'Guatemala', character: 'Smoky, aromatic spice' },
        { name: 'Calabrian Bergamot', origin: 'Italy', character: 'Crisp dark citrus lift' },
      ],
      heart: [
        { name: 'Iris Pallida Butter', origin: 'Florence', character: 'Cool, powdery suede' },
        { name: 'Black Tea Accord', origin: 'Yunnan', character: 'Tannic, velvet depth' },
      ],
      base: [
        { name: 'Atlas Cedarwood', origin: 'Morocco', character: 'Dry architectural wood' },
        { name: 'Siam Benzoin', origin: 'Laos', character: 'Balsamic amber glow' },
      ],
    },
    longevityHours: '10–12 Hours',
    longevityScore: 5,
    sillageLevel: 'Commanding & Refined',
    sillageScore: 4,
    seasonality: 'Year-Round Collector Gift',
    ingredients:
      'Alcohol Denat., Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Coumarin, Alpha-Isomethyl Ionone.',
    rating: 5.0,
    reviewCount: 41,
    isGift: true,
    engravable: true,
    reviews: [
      {
        id: 'rev-gf-1',
        author: 'Arthur Sterling',
        location: 'New York, USA',
        rating: 5,
        title: 'Unmatched unboxing presentation',
        comment:
          'Presented this to my partner with monogrammed initials—the ivory satin box and heavy brass atomizer feel truly heirloom.',
        date: '2026-11-08',
        verified: true,
      },
    ],
  },
];
