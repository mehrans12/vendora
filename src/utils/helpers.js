// utils/helpers.js — VENDORA Utility Helpers

// ─── FORMAT PKR CURRENCY ─────────────────────────────────────────────────
export const formatPKR = (amount) => {
  if (amount === undefined || amount === null) return 'PKR 0';
  return `PKR ${Number(amount).toLocaleString('en-PK')}`;
};

// ─── FORMAT DATE ─────────────────────────────────────────────────────────
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const now = new Date();
  const date = new Date(dateStr);
  const diff = (now - date) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

// ─── TRUNCATE TEXT ────────────────────────────────────────────────────────
export const truncate = (str, max = 80) => {
  if (!str) return '';
  return str.length <= max ? str : str.slice(0, max) + '…';
};

// ─── STARS RENDERER ───────────────────────────────────────────────────────
export const renderStars = (rating, max = 5) => {
  const stars = [];
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  for (let i = 0; i < max; i++) {
    if (i < full) stars.push('★');
    else if (i === full && half) stars.push('½');
    else stars.push('☆');
  }
  return stars.join('');
};

// ─── ORDER STATUS ─────────────────────────────────────────────────────────
export const ORDER_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export const statusLabel = (status) => {
  const map = {
    pending:   'Pending',
    confirmed: 'Confirmed',
    shipped:   'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    active:    'Active',
    inactive:  'Inactive',
  };
  return map[status] || status;
};

export const statusClass = (status) => {
  const map = {
    pending:   'status-pending',
    confirmed: 'status-confirmed',
    shipped:   'status-shipped',
    delivered: 'status-delivered',
    cancelled: 'status-cancelled',
    active:    'status-active',
    inactive:  'status-inactive',
  };
  return map[status] || 'badge badge-muted';
};

// ─── CATEGORIES ────────────────────────────────────────────────────────────
export const CATEGORIES = [
  'Handmade',
  'Organic',
  'Electronics',
  'Clothing',
  'Books',
  'Home & Garden',
  'Beauty',
  'Sports',
  'Toys',
  'Jewelry',
  'Food',
  'Other',
];

export const CATEGORY_ICONS = {
  'Handmade':     '🎨',
  'Organic':      '🌿',
  'Electronics':  '⚡',
  'Clothing':     '👗',
  'Books':        '📚',
  'Home & Garden':'🏡',
  'Beauty':       '💄',
  'Sports':       '⚽',
  'Toys':         '🧸',
  'Jewelry':      '💍',
  'Food':         '🍽️',
  'Other':        '📦',
};

// ─── IMAGE UTILS ──────────────────────────────────────────────────────────
export const imageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    if (file.size > 5 * 1024 * 1024) {
      reject(new Error('Image must be less than 5MB'));
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// ─── MISC ─────────────────────────────────────────────────────────────────
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const calcCartTotal = (cartItems, allProducts) => {
  return cartItems.reduce((sum, item) => {
    const product = allProducts.find((p) => p.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
};

export const calcCartCount = (cartItems) => {
  return (cartItems || []).reduce((sum, item) => sum + item.quantity, 0);
};

// ─── SEED DATA ─────────────────────────────────────────────────────────────
export const SEED_PRODUCTS = [
  {
    sellerId: 'demo-seller-1',
    name: 'Handcrafted Sindhi Ajrak',
    description: 'Authentic hand-block printed Sindhi Ajrak. Each piece is unique, made using natural dyes by master artisans in Sindh. Perfect as a shawl, tablecloth, or wall art.',
    category: 'Handmade',
    price: 3500,
    stock: 25,
    image: null,
    rating: 4.8,
    reviews: 42,
    status: 'active',
  },
  {
    sellerId: 'demo-seller-1',
    name: 'Organic Sidr Honey (500g)',
    description: 'Pure, raw Sidr honey harvested from the Thar Desert. No additives, no heating. Rich in antioxidants and natural enzymes. Certificate of authenticity included.',
    category: 'Organic',
    price: 4200,
    stock: 60,
    image: null,
    rating: 4.9,
    reviews: 87,
    status: 'active',
  },
  {
    sellerId: 'demo-seller-1',
    name: 'Wireless Earbuds Pro',
    description: 'Crystal-clear sound with active noise cancellation. 30-hour battery life, waterproof design. Compatible with all Bluetooth devices. Comes with charging case.',
    category: 'Electronics',
    price: 6800,
    stock: 12,
    image: null,
    rating: 4.3,
    reviews: 28,
    status: 'active',
  },
  {
    sellerId: 'demo-seller-1',
    name: 'Embroidered Lawn Suit',
    description: 'Premium quality 3-piece lawn suit with intricate embroidery. Machine washable, comfortable fit. Available in multiple colors. Includes kameez, shalwar, and dupatta.',
    category: 'Clothing',
    price: 5500,
    stock: 18,
    image: null,
    rating: 4.6,
    reviews: 55,
    status: 'active',
  },
  {
    sellerId: 'demo-seller-1',
    name: 'Urdu Adab Collection (5 Books)',
    description: 'Curated collection of 5 classic Urdu literary works including poetry by Faiz and prose by Ismat. Hardcover editions with beautiful binding. Perfect gift for literature lovers.',
    category: 'Books',
    price: 2800,
    stock: 30,
    image: null,
    rating: 4.7,
    reviews: 19,
    status: 'active',
  },
  {
    sellerId: 'demo-seller-1',
    name: 'Handmade Pottery Set',
    description: 'Set of 6 handcrafted clay bowls, each painted with traditional Pakistani motifs. Microwave and dishwasher safe. Adds cultural elegance to any dining table.',
    category: 'Home & Garden',
    price: 4800,
    stock: 8,
    image: null,
    rating: 4.5,
    reviews: 33,
    status: 'active',
  },
  {
    sellerId: 'demo-seller-1',
    name: 'Rilli Patchwork Cushion Covers',
    description: 'Traditional Sindhi Rilli patchwork cushion covers (set of 2). Handstitched by women artisans in Sukkur. Vibrant colors that brighten any living space.',
    category: 'Home & Garden',
    price: 1800,
    stock: 45,
    image: null,
    rating: 4.4,
    reviews: 61,
    status: 'active',
  },
  {
    sellerId: 'demo-seller-1',
    name: 'Moringa Powder (250g)',
    description: 'Premium organic Moringa powder from farms in Punjab. Rich in vitamins, minerals, and amino acids. Add to smoothies, teas, or meals. Packed fresh to order.',
    category: 'Organic',
    price: 950,
    stock: 100,
    image: null,
    rating: 4.6,
    reviews: 74,
    status: 'active',
  },
];

export const DEMO_SELLER = {
  email: 'seller@vendora.pk',
  password: 'seller123',
  name: 'Ayesha Khan',
  role: 'seller',
  profile: {
    businessName: "Ayesha's Craft House",
    businessDescription: 'Authentic handmade Pakistani crafts, organic foods, and premium products. Supporting local artisans since 2020.',
    phone: '+923001234567',
    address: 'Larkana, Sindh, Pakistan',
    avatar: null,
  },
  rating: 4.7,
  totalOrders: 156,
};

export const DEMO_BUYER = {
  email: 'buyer@vendora.pk',
  password: 'buyer123',
  name: 'Ahmed Ali',
  role: 'buyer',
  profile: {
    businessName: '',
    businessDescription: '',
    phone: '+923451234567',
    address: '45 Gulshan Avenue, Karachi, Pakistan',
    avatar: null,
  },
  rating: 0,
  totalOrders: 5,
};

export const DEMO_ADMIN = {
  email: 'admin@vendora.pk',
  password: 'admin123',
  name: 'VENDORA Admin',
  role: 'admin',
  profile: {
    businessName: 'VENDORA Admin',
    businessDescription: 'Platform administrator.',
    phone: '+920000000000',
    address: 'Islamabad, Pakistan',
    avatar: null,
  },
  rating: 0,
  totalOrders: 0,
};
