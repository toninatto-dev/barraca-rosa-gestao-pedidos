import { DollarSign, ShoppingBag, Receipt, TrendingUp } from 'lucide-react';
import type { Order } from '@/types';
import { formatCurrency } from '@/lib/cart';

interface DashboardProps {
  orders: Order[];
}

const CATEGORY_COLORS: Record<string, string> = {
  'Café e Lanches': '#D10068',
  'Sabores que Encantam': '#E63970',
  'Bebidas': '#F472B6',
};

export function Dashboard({ orders }: DashboardProps) {
  const completed = orders.filter((o) => o.status === 'Concluído');
  const totalRevenue = completed.reduce((s, o) => s + o.total, 0);
  const totalOrders = completed.length;
  const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const categoryTotals: Record<string, number> = {};
  completed.forEach((order) => {
    order.items.forEach((item) => {
      const cat = item.category;
      categoryTotals[cat] = (categoryTotals[cat] ?? 0) + item.price * item.quantity;
    });
  });

  const categoryEntries = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1]
  );
  const maxCategory = Math.max(1, ...categoryEntries.map((e) => e[1]));

  const cards = [
    {
      label: 'Faturamento do Dia',
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
    },
    {
      label: 'Pedidos Concluídos',
      value: String(totalOrders),
      icon: ShoppingBag,
    },
    {
      label: 'Ticket Médio',
      value: totalOrders > 0 ? formatCurrency(avgTicket) : '—',
      icon: Receipt,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-2xl border-2 border-[#FBCFE8] bg-white p-5 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF0F5]">
                  <Icon className="h-6 w-6 text-[#D10068]" aria-hidden="true" />
                </div>
              </div>
              <p className="mt-4 text-2xl font-black text-gray-800">
                {card.value}
              </p>
              <p className="mt-1 text-xs font-medium text-gray-400">
                {card.label}
              </p>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border-2 border-[#FBCFE8] bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-[#D10068]" aria-hidden="true" />
          <h2 className="text-lg font-bold text-gray-800">
            Vendas por Categoria
          </h2>
        </div>

        {categoryEntries.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400">
            Nenhuma venda concluída ainda para exibir.
          </p>
        ) : (
          <div className="space-y-4">
            {categoryEntries.map(([cat, value]) => {
              const pct = Math.round((value / maxCategory) * 100);
              return (
                <div key={cat}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-700">
                      {cat}
                    </span>
                    <span className="text-sm font-black text-[#D10068]">
                      {formatCurrency(value)}
                    </span>
                  </div>
                  <div
                    className="h-4 w-full overflow-hidden rounded-full bg-[#FFF0F5]"
                    role="img"
                    aria-label={`${cat}: ${formatCurrency(value)}`}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${pct}%`,
                        backgroundColor:
                          CATEGORY_COLORS[cat] ?? '#D10068',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
