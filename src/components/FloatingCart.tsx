import { ShoppingBag } from 'lucide-react';
import type { CartItem } from '@/types';
import { formatCurrency, getTotalItems } from '@/lib/cart';

interface FloatingCartProps {
  cart: CartItem[];
  onCheckout: () => void;
}

export function FloatingCart({ cart, onCheckout }: FloatingCartProps) {
  const count = getTotalItems(cart);
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  if (count === 0) return null;

  return (
    <button
      onClick={onCheckout}
      aria-label={`Ver carrinho com ${count} itens, total ${formatCurrency(total)}`}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-2xl bg-[#D10068] px-5 py-4 text-white shadow-2xl transition-all duration-300 hover:bg-[#E63970] hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D10068]/40 animate-bounce-subtle"
    >
      <div className="relative">
        <ShoppingBag className="h-6 w-6" aria-hidden="true" />
        <span
          className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-black text-[#D10068]"
          aria-hidden="true"
        >
          {count}
        </span>
      </div>
      <div className="flex flex-col items-start">
        <span className="text-xs font-medium text-white/80">
          {count} {count === 1 ? 'item' : 'itens'}
        </span>
        <span className="text-base font-black">
          {formatCurrency(total)}
        </span>
      </div>
    </button>
  );
}
