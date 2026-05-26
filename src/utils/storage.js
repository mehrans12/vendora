// utils/storage.js — VENDORA LocalStorage utilities

export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const initializeStorage = () => {
  if (!localStorage.getItem('vendora_users')) {
    localStorage.setItem('vendora_users', JSON.stringify([]));
  }
  if (!localStorage.getItem('vendora_products')) {
    localStorage.setItem('vendora_products', JSON.stringify([]));
  }
  if (!localStorage.getItem('vendora_orders')) {
    localStorage.setItem('vendora_orders', JSON.stringify([]));
  }
  if (!localStorage.getItem('vendora_carts')) {
    localStorage.setItem('vendora_carts', JSON.stringify([]));
  }
};

// ─── USERS ─────────────────────────────────────────────────────────────────
export const users = {
  getAll: () => JSON.parse(localStorage.getItem('vendora_users') || '[]'),

  create: (user) => {
    const all = users.getAll();
    const newUser = {
      ...user,
      id: user.id || generateUUID(),
      createdAt: new Date().toISOString(),
    };
    all.push(newUser);
    localStorage.setItem('vendora_users', JSON.stringify(all));
    return newUser;
  },

  findByEmail: (email) =>
    users.getAll().find((u) => u.email.toLowerCase() === email.toLowerCase()),

  findById: (id) => users.getAll().find((u) => u.id === id),

  update: (id, updates) => {
    const all = users.getAll();
    const idx = all.findIndex((u) => u.id === id);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...updates };
      localStorage.setItem('vendora_users', JSON.stringify(all));
      return all[idx];
    }
    return null;
  },
};

// ─── PRODUCTS ───────────────────────────────────────────────────────────────
export const products = {
  getAll: () => JSON.parse(localStorage.getItem('vendora_products') || '[]'),

  create: (product) => {
    const all = products.getAll();
    const newProduct = {
      id: generateUUID(),
      rating: 0,
      reviews: 0,
      ...product,
      createdAt: new Date().toISOString(),
    };
    all.push(newProduct);
    localStorage.setItem('vendora_products', JSON.stringify(all));
    return newProduct;
  },

  findById: (id) => products.getAll().find((p) => p.id === id),

  findBySellerId: (sellerId) =>
    products.getAll().filter((p) => p.sellerId === sellerId),

  getActive: () =>
    products.getAll().filter((p) => p.status === 'active'),

  update: (id, updates) => {
    const all = products.getAll();
    const idx = all.findIndex((p) => p.id === id);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem('vendora_products', JSON.stringify(all));
      return all[idx];
    }
    return null;
  },

  delete: (id) => {
    const all = products.getAll().filter((p) => p.id !== id);
    localStorage.setItem('vendora_products', JSON.stringify(all));
  },
};

// ─── ORDERS ─────────────────────────────────────────────────────────────────
export const orders = {
  getAll: () => JSON.parse(localStorage.getItem('vendora_orders') || '[]'),

  create: (order) => {
    const all = orders.getAll();
    const newOrder = {
      id: generateUUID(),
      ...order,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    all.push(newOrder);
    localStorage.setItem('vendora_orders', JSON.stringify(all));
    return newOrder;
  },

  findById: (id) => orders.getAll().find((o) => o.id === id),

  findByBuyerId: (buyerId) =>
    orders.getAll().filter((o) => o.buyerId === buyerId),

  findBySellerId: (sellerId) =>
    orders.getAll().filter((o) => o.sellerId === sellerId),

  updateStatus: (id, status) => {
    const all = orders.getAll();
    const idx = all.findIndex((o) => o.id === id);
    if (idx !== -1) {
      all[idx] = { ...all[idx], status, updatedAt: new Date().toISOString() };
      localStorage.setItem('vendora_orders', JSON.stringify(all));
      return all[idx];
    }
    return null;
  },
};

// ─── CARTS ──────────────────────────────────────────────────────────────────
export const carts = {
  getAll: () => JSON.parse(localStorage.getItem('vendora_carts') || '[]'),

  getByBuyerId: (buyerId) =>
    carts.getAll().find((c) => c.buyerId === buyerId),

  _save: (all) => localStorage.setItem('vendora_carts', JSON.stringify(all)),

  create: (buyerId) => {
    const all = carts.getAll();
    const newCart = { buyerId, items: [], lastUpdated: new Date().toISOString() };
    all.push(newCart);
    carts._save(all);
    return newCart;
  },

  addItem: (buyerId, productId, quantity = 1) => {
    const all = carts.getAll();
    let cart = all.find((c) => c.buyerId === buyerId);
    if (!cart) {
      cart = { buyerId, items: [], lastUpdated: new Date().toISOString() };
      all.push(cart);
    }
    const itemIdx = cart.items.findIndex((i) => i.productId === productId);
    if (itemIdx !== -1) {
      cart.items[itemIdx].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
    cart.lastUpdated = new Date().toISOString();
    carts._save(all);
    return cart;
  },

  updateQuantity: (buyerId, productId, quantity) => {
    const all = carts.getAll();
    const cart = all.find((c) => c.buyerId === buyerId);
    if (cart) {
      const itemIdx = cart.items.findIndex((i) => i.productId === productId);
      if (itemIdx !== -1) {
        if (quantity <= 0) {
          cart.items.splice(itemIdx, 1);
        } else {
          cart.items[itemIdx].quantity = quantity;
        }
        cart.lastUpdated = new Date().toISOString();
        carts._save(all);
      }
    }
    return cart;
  },

  removeItem: (buyerId, productId) => {
    const all = carts.getAll();
    const cart = all.find((c) => c.buyerId === buyerId);
    if (cart) {
      cart.items = cart.items.filter((i) => i.productId !== productId);
      cart.lastUpdated = new Date().toISOString();
      carts._save(all);
    }
    return cart;
  },

  clear: (buyerId) => {
    const all = carts.getAll();
    const cart = all.find((c) => c.buyerId === buyerId);
    if (cart) {
      cart.items = [];
      cart.lastUpdated = new Date().toISOString();
      carts._save(all);
    }
    return cart;
  },
};

// ─── SESSION ────────────────────────────────────────────────────────────────
export const session = {
  set: (user) => {
    localStorage.setItem(
      'vendora_currentUser',
      JSON.stringify({ ...user, token: 'session_' + Date.now() })
    );
  },
  get: () => {
    const u = localStorage.getItem('vendora_currentUser');
    return u ? JSON.parse(u) : null;
  },
  clear: () => localStorage.removeItem('vendora_currentUser'),
  isLoggedIn: () => !!session.get(),
};
