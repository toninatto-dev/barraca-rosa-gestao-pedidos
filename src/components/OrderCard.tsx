import { Clock, ChevronRight, ShoppingBag } from 'lucide-react';
import type { Order, OrderStatus } from '@/types';
import { formatCurrency } from '@/lib/cart';

interface OrderCardProps {
  order: Order;
  onAdvance: (id: string, status: OrderStatus) => void;
  statusColors: Record<OrderStatus, string>;
  statusFlow: OrderStatus[];
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function OrderCard({
  order,
  onAdvance,
  statusColors,
  statusFlow,
}: OrderCardProps) {
  const currentIdx = statusFlow.indexOf(order.status);
  const isLast = currentIdx === statusFlow.length - 1;

  return (
    <div className="rounded-xl border border-[#FBCFE8] bg-[#FFF0F5]/30 p-4 transition-all hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-800">{order.customer_name}</h3>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {formatTime(order.created_at)}
            </span>
          </div>
          <div className="mt-2 flex items-start gap-2">
            <ShoppingBag className="h-4 w-4 mt-0.5 text-[#D10068] flex-shrink-0" aria-hidden="true" />
            <div className="flex-1">
              {order.items.map((item, i) => (
                <p key={i} className="text-sm text-gray-600">
                  {item.quantity}x {item.name}
                </p>
              ))}
              {order.notes && (
                <p className="mt-1 text-xs italic text-gray-400">
                  Obs: {order.notes}
                </p>
              )}
            </div>
          </div>
          <p className="mt-2 text-lg font-black text-[#D10068]">
            {formatCurrency(order.total)}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span
            className={`rounded-full border px-3 py-1 text-xs font-bold ${statusColors[order.status]}`}
          >
            {order.status}
          </span>
          {!isLast && (
            <button
              onClick={() => onAdvance(order.id, order.status)}
              aria-label={`Avançar pedido de ${order.customer_name} para ${statusFlow[currentIdx + 1]}`}
              className="flex items-center gap-1 rounded-lg bg-[#D10068] px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-[#E63970] hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D10068]/30 active:scale-95"
            >
              {statusFlow[currentIdx + 1]}
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
