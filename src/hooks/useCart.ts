import { useState, useCallback, useMemo } from 'react';
import type { CartItem, MenuItem } from '@/types';
import {
  addToCart as addToCartLogic,
  removeFromCart as removeFromCartLogic,
  calculateTotal,
  getTotalItems,
} from '@/lib/cart';

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addItem = useCallback((item: MenuItem) => {
    setCart((prev) => addToCartLogic(prev, item));
  }, []);

  const removeItem = useCallback((id: string) => {
    setCart((prev) => removeFromCartLogic(prev, id));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const total = useMemo(() => calculateTotal(cart), [cart]);
  const totalItems = useMemo(() => getTotalItems(cart), [cart]);

  return {
    cart,
    addItem,
    removeItem,
    clearCart,
    total,
    totalItems,
  };
}
