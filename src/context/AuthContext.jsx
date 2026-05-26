import React, { createContext, useState, useEffect, useCallback } from 'react';
import * as storage from '../utils/storage';
import { SEED_PRODUCTS, DEMO_SELLER, DEMO_BUYER, DEMO_ADMIN } from '../utils/helpers';

export const AuthContext = createContext();

const seedDemoData = () => {
  const existingUsers = storage.users.getAll();

  // Always ensure the admin account exists (upsert)
  const adminExists = existingUsers.find(u => u.email === DEMO_ADMIN.email);
  if (!adminExists) {
    storage.users.create({ ...DEMO_ADMIN, id: 'demo-admin-1' });
  }

  if (existingUsers.length > 0) return; // Products & other demo users already seeded

  // Create demo seller
  const seller = storage.users.create({ ...DEMO_SELLER, id: 'demo-seller-1' });

  // Create demo buyer
  storage.users.create({ ...DEMO_BUYER });

  // Seed products with seller id
  SEED_PRODUCTS.forEach((p) => {
    storage.products.create({ ...p, sellerId: seller.id, sellerName: DEMO_SELLER.profile.businessName });
  });
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storage.initializeStorage();
    seedDemoData();
    const savedUser = storage.session.get();
    if (savedUser) {
      // Re-fetch user from storage to get latest data
      const fullUser = storage.users.findById(savedUser.id);
      setUser(fullUser ? { ...savedUser, profile: fullUser.profile, name: fullUser.name } : savedUser);
    }
    setLoading(false);
  }, []);

  const signup = useCallback((email, password, name, role) => {
    const existing = storage.users.findByEmail(email);
    if (existing) throw new Error('An account with this email already exists.');

    const newUser = storage.users.create({
      email,
      password,
      name,
      role,
      profile: {
        businessName: '',
        businessDescription: '',
        phone: '',
        address: '',
        avatar: null,
      },
      rating: 0,
      totalOrders: 0,
    });

    const sessionUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      profile: newUser.profile,
    };
    storage.session.set(sessionUser);
    setUser(sessionUser);
    return sessionUser;
  }, []);

  const login = useCallback((email, password) => {
    const found = storage.users.findByEmail(email);
    if (!found || found.password !== password) {
      throw new Error('Invalid email or password. Please try again.');
    }
    const sessionUser = {
      id: found.id,
      email: found.email,
      name: found.name,
      role: found.role,
      profile: found.profile,
    };
    storage.session.set(sessionUser);
    setUser(sessionUser);
    return sessionUser;
  }, []);

  const logout = useCallback(() => {
    storage.session.clear();
    setUser(null);
  }, []);

  const updateProfile = useCallback((updates) => {
    if (!user) return null;
    const updated = storage.users.update(user.id, updates);
    if (updated) {
      const sessionUser = { ...user, ...updates, profile: updated.profile };
      storage.session.set(sessionUser);
      setUser(sessionUser);
    }
    return updated;
  }, [user]);

  const refreshUser = useCallback(() => {
    if (!user) return;
    const fullUser = storage.users.findById(user.id);
    if (fullUser) {
      const sessionUser = { ...user, profile: fullUser.profile, name: fullUser.name };
      storage.session.set(sessionUser);
      setUser(sessionUser);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, updateProfile, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
