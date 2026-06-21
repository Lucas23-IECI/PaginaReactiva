'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types';

export type CartItem = {
  product: Product;
  quantity: number;
  format: 'unit' | 'box';
};

interface CartContextType {
  items: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity: number, format: 'unit' | 'box') => void;
  removeFromCart: (sku: string, format: 'unit' | 'box') => void;
  updateQuantity: (sku: string, format: 'unit' | 'box', quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Cargar desde localStorage al inicializar
  useEffect(() => {
    try {
      const saved = localStorage.getItem('reactiva_cart');
      if (saved) {
        // eslint-disable-next-line
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load cart from local storage', e);
    }
  }, []);

  // Guardar en localStorage cuando cambian los items
  useEffect(() => {
    try {
      localStorage.setItem('reactiva_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to local storage', e);
    }
  }, [items]);

  const addToCart = (product: Product, quantity: number, format: 'unit' | 'box') => {
    setItems((prev) => {
      const existingItem = prev.find((i) => i.product.sku === product.sku && i.format === format);
      if (existingItem) {
        return prev.map((i) =>
          i.product.sku === product.sku && i.format === format
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { product, quantity, format }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (sku: string, format: 'unit' | 'box') => {
    setItems((prev) => prev.filter((i) => !(i.product.sku === sku && i.format === format)));
  };

  const updateQuantity = (sku: string, format: 'unit' | 'box', quantity: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.product.sku === sku && i.format === format ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
