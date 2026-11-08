import { Plus, Minus } from 'lucide-react';
import type { MenuItem, CartItem } from '@/types';
import { formatCurrency } from '@/lib/cart';

interface MenuCardProps {
  item: MenuItem;
  cart: CartItem[];
  onAdd: (item: MenuItem) => void;
  onRemove: (id: string) => void;
}

export function MenuCard({ item, cart, onAdd, onRemove }: MenuCardProps) {
  const inCart = cart.find((c) => c.id === item.id);
  const quantity = inCart?.quantity ?? 0;

  return (
    <article className="group relative flex flex-col rounded-2xl border-2 border-[#FBCFE8] bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-[#E63970] hover:-translate-y-1">
      {item.isNew && (
        <span
          className="absolute -top-3 left-4 rounded-full bg-[#E63970] px-3 py-1 text-xs font-bold text-white shadow-md"
          aria-label="Produto novo"
        >
          NOVO!
        </span>
      )}

      <h3 className="text-lg font-bold text-gray-800 leading-snug">
        {item.name}
      </h3>
      <p className="mt-1 flex-1 text-sm text-gray-500 leading-relaxed">
        {item.description}
      </p>
      <p className="mt-3 text-2xl font-black text-[#D10068]">
        {formatCurrency(item.price)}
      </p>

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={() => onAdd(item)}
          disabled={false}
          aria-label={`Adicionar ${item.name} ao carrinho`}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#D10068] px-4 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:bg-[#E63970] hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D10068]/30 active:scale-95"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Adicionar
        </button>

        {quantity > 0 && (
          <div className="flex items-center gap-2 rounded-xl border-2 border-[#FBCFE8] bg-[#FFF0F5] px-2 py-1">
            <button
              onClick={() => onRemove(item.id)}
              aria-label={`Remover uma unidade de ${item.name} do carrinho`}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[#D10068] shadow-sm transition-all hover:bg-[#FBCFE8] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D10068]/30 active:scale-90"
            >
              <Minus className="h-4 w-4" aria-hidden="true" />
            </button>
            <span
              className="min-w-[1.5rem] text-center text-sm font-bold text-[#D10068]"
              aria-label={`${quantity} no carrinho`}
            >
              {quantity}
            </span>
            <button
              onClick={() => onAdd(item)}
              aria-label={`Adicionar mais uma unidade de ${item.name} ao carrinho`}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[#D10068] shadow-sm transition-all hover:bg-[#FBCFE8] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D10068]/30 active:scale-90"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
