import { describe, it, expect } from 'vitest';
import {
  addToCart,
  removeFromCart,
  calculateTotal,
  getTotalItems,
} from '@/lib/cart';
import type { CartItem, MenuItem } from '@/types';
import { menuItems } from '@/data/menu';

describe('Carrinho — cálculo de total e inserção de produtos', () => {
  const sampleItems: MenuItem[] = menuItems.slice(0, 3);

  it('deve adicionar um item ao carrinho vazio', () => {
    const cart = addToCart([], sampleItems[0]);
    expect(cart).toHaveLength(1);
    expect(cart[0].id).toBe(sampleItems[0].id);
    expect(cart[0].quantity).toBe(1);
  });

  it('deve incrementar a quantidade ao adicionar o mesmo item', () => {
    let cart = addToCart([], sampleItems[0]);
    cart = addToCart(cart, sampleItems[0]);
    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(2);
  });

  it('deve adicionar múltiplos itens diferentes', () => {
    let cart: CartItem[] = [];
    cart = addToCart(cart, sampleItems[0]);
    cart = addToCart(cart, sampleItems[1]);
    cart = addToCart(cart, sampleItems[2]);
    expect(cart).toHaveLength(3);
  });

  it('deve calcular o total corretamente com múltiplos itens', () => {
    let cart: CartItem[] = [];
    cart = addToCart(cart, sampleItems[0]);
    cart = addToCart(cart, sampleItems[0]);
    cart = addToCart(cart, sampleItems[1]);
    const expected =
      sampleItems[0].price * 2 + sampleItems[1].price;
    expect(calculateTotal(cart)).toBe(expected);
  });

  it('deve calcular o total corretamente com quantidades variadas', () => {
    let cart: CartItem[] = [];
    cart = addToCart(cart, sampleItems[0]); // 1x
    cart = addToCart(cart, sampleItems[0]); // 2x
    cart = addToCart(cart, sampleItems[0]); // 3x
    cart = addToCart(cart, sampleItems[1]); // 1x
    cart = addToCart(cart, sampleItems[2]); // 1x
    const expected =
      sampleItems[0].price * 3 +
      sampleItems[1].price +
      sampleItems[2].price;
    expect(calculateTotal(cart)).toBe(expected);
  });

  it('deve retornar 0 para carrinho vazio', () => {
    expect(calculateTotal([])).toBe(0);
  });

  it('deve remover (decrementar) um item do carrinho', () => {
    let cart = addToCart([], sampleItems[0]);
    cart = addToCart(cart, sampleItems[0]); // qty = 2
    cart = removeFromCart(cart, sampleItems[0].id);
    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(1);
  });

  it('deve remover completamente o item quando quantidade chega a 0', () => {
    let cart = addToCart([], sampleItems[0]); // qty = 1
    cart = removeFromCart(cart, sampleItems[0].id); // qty = 0 → removed
    expect(cart).toHaveLength(0);
  });

  it('deve contar o total de itens corretamente', () => {
    let cart: CartItem[] = [];
    cart = addToCart(cart, sampleItems[0]);
    cart = addToCart(cart, sampleItems[0]);
    cart = addToCart(cart, sampleItems[1]);
    expect(getTotalItems(cart)).toBe(3);
  });

  it('deve retornar 0 itens para carrinho vazio', () => {
    expect(getTotalItems([])).toBe(0);
  });

  it('deve não afetar outros itens ao remover um', () => {
    let cart: CartItem[] = [];
    cart = addToCart(cart, sampleItems[0]);
    cart = addToCart(cart, sampleItems[1]);
    cart = addToCart(cart, sampleItems[1]);
    cart = removeFromCart(cart, sampleItems[1].id);
    expect(cart).toHaveLength(2);
    expect(cart[0].id).toBe(sampleItems[0].id);
    expect(cart[0].quantity).toBe(1);
    expect(cart[1].id).toBe(sampleItems[1].id);
    expect(cart[1].quantity).toBe(1);
  });
});
