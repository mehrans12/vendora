import React, { createContext, useState, useCallback, useEffect } from 'react';
import * as storage from '../utils/storage';
import { calcCartCount } from '../utils/helpers';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const syncCount = (c) => {
    setCartCount(c ? calcCartCount(c.items) : 0);
  };

  const initCart = useCallback((buyerId) => {
    let userCart = storage.carts.getByBuyerId(buyerId);
    if (!userCart) userCart = storage.carts.create(buyerId);
    setCart(userCart);
    syncCount(userCart);
  }, []);

  const resetCart = useCallback(() => {
    setCart(null);
    setCartCount(0);
  }, []);

  const addToCart = useCallback((buyerId, productId, quantity = 1) => {
    const updated = storage.carts.addItem(buyerId, productId, quantity);
    setCart(updated);
    syncCount(updated);
    return updated;
  }, []);

  const updateQuantity = useCallback((buyerId, productId, quantity) => {
    const updated = storage.carts.updateQuantity(buyerId, productId, quantity);
    setCart(updated ? { ...updated } : null);
    syncCount(updated);
    return updated;
  }, []);

  const removeFromCart = useCallback((buyerId, productId) => {
    const updated = storage.carts.removeItem(buyerId, productId);
    setCart(updated ? { ...updated } : null);
    syncCount(updated);
    return updated;
  }, []);

  const clearCart = useCallback((buyerId) => {
    const updated = storage.carts.clear(buyerId);
    setCart(updated ? { ...updated } : null);
    syncCount(updated);
    return updated;
  }, []);

  return (
    <CartContext.Provider value={{
      cart,
      cartCount,
      initCart,
      resetCart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};
