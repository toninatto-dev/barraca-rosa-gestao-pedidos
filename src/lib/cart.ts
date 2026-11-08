import type { CartItem, MenuItem } from '@/types';

export function addToCart(
  cart: CartItem[],
  item: MenuItem
): CartItem[] {
  const existing = cart.find((c) => c.id === item.id);
  if (existing) {
    return cart.map((c) =>
      c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
    );
  }
  return [...cart, { ...item, quantity: 1 }];
}

export function removeFromCart(
  cart: CartItem[],
  id: string
): CartItem[] {
  return cart
    .map((c) =>
      c.id === id ? { ...c, quantity: c.quantity - 1 } : c
    )
    .filter((c) => c.quantity > 0);
}

export function calculateTotal(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function getTotalItems(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}
