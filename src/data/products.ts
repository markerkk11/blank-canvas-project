// Product data with prices matching the 30% discount and nearest 10 kr rounding
export interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'varmepellets' | 'stroprodukter';
  price: number;
  unit: string;
  unitPlural: string;
  image: string;
  description: string;
  specs: {
    shipping: string;
    size?: string;
    weight?: string;
  };
  inStock: boolean;
}

export const products: Product[] = [
  {
    id: 'varmepellets-6mm',
    name: 'Värmepellets 6mm',
    slug: 'varmepellets-6mm',
    category: 'varmepellets',
    price: 2940,
    unit: 'pall',
    unitPlural: 'pallar',
    image: '/src/assets/products/varmepellets-6mm.webp',
    description: 'Högkvalitativa värmepellets 6mm för effektiv uppvärmning. Tillverkade av rent trä utan tillsatser.',
    specs: {
      shipping: 'Pall',
      size: '6mm',
      weight: '16 kg/säck',
    },
    inStock: true,
  },
  {
    id: 'varmepellets-8mm',
    name: 'Värmepellets 8mm',
    slug: 'varmepellets-8mm',
    category: 'varmepellets',
    price: 2940,
    unit: 'pall',
    unitPlural: 'pallar',
    image: '/src/assets/products/varmepellets-8mm.webp',
    description: 'Högkvalitativa värmepellets 8mm för effektiv uppvärmning. Tillverkade av rent trä utan tillsatser.',
    specs: {
      shipping: 'Pall',
      size: '8mm',
      weight: '16 kg/säck',
    },
    inStock: true,
  },
  {
    id: 'varmepellets-8mm-bulk',
    name: 'Värmepellets 8mm Bulk',
    slug: 'varmepellets-8mm-bulk',
    category: 'varmepellets',
    price: 3180,
    unit: 'ton',
    unitPlural: 'ton',
    image: '/src/assets/products/varmepellets-8mm-bulk.webp',
    description: 'Värmepellets 8mm i bulk för storskalig uppvärmning. Levereras löst direkt till din anläggning.',
    specs: {
      shipping: 'Bulk',
      size: '8mm',
    },
    inStock: true,
  },
  {
    id: 'stropellets',
    name: 'Ströpellets',
    slug: 'stropellets',
    category: 'stroprodukter',
    price: 2800,
    unit: 'pall',
    unitPlural: 'pallar',
    image: '/src/assets/products/stropellets.webp',
    description: 'Premium ströpellets för djurhållning. Extremt absorberande och dammfritt.',
    specs: {
      shipping: 'Pall',
      size: '8mm',
    },
    inStock: true,
  },
  {
    id: 'storsack-stropellets-8mm',
    name: 'Storsäck Ströpellets',
    slug: 'storsack-stropellets-8mm',
    category: 'stroprodukter',
    price: 1770,
    unit: 'säck',
    unitPlural: 'säckar',
    image: '/src/assets/products/storsack.webp',
    description: 'Ströpellets i praktisk storsäck om 500 kg. Perfekt för större djurhållare.',
    specs: {
      shipping: 'Storsäck',
      size: '8mm',
      weight: '500 kg/säck',
    },
    inStock: true,
  },
  {
    id: 'storsack-varmepellets-8mm',
    name: 'Storsäck Pellets 8mm',
    slug: 'storsack-varmepellets-8mm',
    category: 'varmepellets',
    price: 1770,
    unit: 'säck',
    unitPlural: 'säckar',
    image: '/src/assets/products/storsack.webp',
    description: 'Värmepellets 8mm i praktisk storsäck om 500 kg.',
    specs: {
      shipping: 'Storsäck',
      size: '8mm',
      weight: '500 kg/säck',
    },
    inStock: true,
  },
  {
    id: 'laxa-finspan',
    name: 'Laxå Finspån',
    slug: 'laxa-finspan',
    category: 'stroprodukter',
    price: 2450,
    unit: 'pall',
    unitPlural: 'pallar',
    image: '/src/assets/products/laxa-finspan.webp',
    description: 'Finspån av hög kvalitet för djurhållning. Mjukt och bekvämt för djuren.',
    specs: {
      shipping: 'Pall',
      weight: '15 kg/bal',
    },
    inStock: true,
  },
  {
    id: 'laxa-kutterspan',
    name: 'Laxå Kutterspån',
    slug: 'laxa-kutterspan',
    category: 'stroprodukter',
    price: 1820,
    unit: 'pall',
    unitPlural: 'pallar',
    image: '/src/assets/products/laxa-kutterspan.webp',
    description: 'Kutterspån för djurhållning. Naturligt och absorberande strömaterial.',
    specs: {
      shipping: 'Pall',
      weight: '15 kg/bal',
    },
    inStock: true,
  },
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};

export const getProductsByCategory = (category: 'varmepellets' | 'stroprodukter'): Product[] => {
  return products.filter(p => p.category === category);
};

export const formatPrice = (price: number): string => {
  return price.toLocaleString('sv-SE') + ' kr';
};
