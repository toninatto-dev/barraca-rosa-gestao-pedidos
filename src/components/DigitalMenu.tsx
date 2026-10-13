import { useState } from 'react';
import { menuItems, categories } from '@/data/menu';
import type { CartItem, MenuItem } from '@/types';
import { MenuCard } from './MenuCard';

interface DigitalMenuProps {
  cart: CartItem[];
  onAdd: (item: MenuItem) => void;
  onRemove: (id: string) => void;
}

export function DigitalMenu({ cart, onAdd, onRemove }: DigitalMenuProps) {
  const [activeCategory, setActiveCategory] = useState<string>(
    categories[0]
  );

  const filtered = menuItems.filter((i) => i.category === activeCategory);

  return (
    <section aria-label="Cardápio Digital" className="mx-auto max-w-5xl px-4">
      <nav
        aria-label="Categorias do cardápio"
        className="mb-8 flex flex-wrap gap-3"
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            aria-pressed={activeCategory === cat}
            className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D10068]/30 ${
              activeCategory === cat
                ? 'bg-[#D10068] text-white shadow-lg scale-105'
                : 'bg-white text-[#D10068] border-2 border-[#FBCFE8] hover:border-[#E63970]'
            }`}
          >
            {cat}
          </button>
        ))}
      </nav>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <MenuCard
            key={item.id}
            item={item}
            cart={cart}
            onAdd={onAdd}
            onRemove={onRemove}
          />
        ))}
      </div>
    </section>
  );
}
