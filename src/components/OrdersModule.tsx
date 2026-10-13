import { useState, useEffect, useCallback } from 'react';
import { ClipboardList, Clock, Loader2, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Order, OrderStatus } from '@/types';
import { formatCurrency } from '@/lib/cart';
import { OrderCard } from './OrderCard';

const STATUS_FLOW: OrderStatus[] = ['Pendente', 'Em Preparo', 'Concluído'];

const STATUS_COLORS: Record<OrderStatus, string> = {
  'Pendente': 'bg-amber-100 text-amber-700 border-amber-300',
  'Em Preparo': 'bg-blue-100 text-blue-700 border-blue-300',
  'Concluído': 'bg-green-100 text-green-700 border-green-300',
};

interface OrdersModuleProps {
  refreshKey: number;
  onOrderUpdated: () => void;
}

export function OrdersModule({ refreshKey, onOrderUpdated }: OrdersModuleProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<OrderStatus | 'todos'>('todos');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (err) {
      setError('Não foi possível carregar os pedidos.');
    } else {
      setOrders((data ?? []) as Order[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders, refreshKey]);

  const advanceStatus = async (id: string, currentStatus: OrderStatus) => {
    const idx = STATUS_FLOW.indexOf(currentStatus);
    const nextStatus = STATUS_FLOW[(idx + 1) % STATUS_FLOW.length];
    const { error: err } = await supabase
      .from('orders')
      .update({ status: nextStatus })
      .eq('id', id);
    if (err) {
      setError('Erro ao atualizar status do pedido.');
    } else {
      onOrderUpdated();
      fetchOrders();
    }
  };

  const filtered = filter === 'todos'
    ? orders
    : orders.filter((o) => o.status === filter);

  return (
    <div className="rounded-2xl border-2 border-[#FBCFE8] bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-[#D10068]" aria-hidden="true" />
          <h2 className="text-lg font-bold text-gray-800">Pedidos Recebidos</h2>
        </div>
        <button
          onClick={fetchOrders}
          aria-label="Atualizar lista de pedidos"
          className="flex items-center gap-1.5 rounded-lg bg-[#FFF0F5] px-3 py-2 text-xs font-bold text-[#D10068] hover:bg-[#FBCFE8] transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D10068]/30"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          Atualizar
        </button>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {(['todos', ...STATUS_FLOW] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            aria-pressed={filter === s}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              filter === s
                ? 'bg-[#D10068] text-white shadow-md'
                : 'bg-[#FFF0F5] text-[#D10068] hover:bg-[#FBCFE8]'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-xl border-2 border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-[#D10068]">
          <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center">
          <Clock className="mx-auto mb-3 h-10 w-10 text-[#FBCFE8]" aria-hidden="true" />
          <p className="text-sm text-gray-500">
            Nenhum pedido {filter !== 'todos' ? `com status "${filter}"` : 'recebido ainda'}.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onAdvance={advanceStatus}
              statusColors={STATUS_COLORS}
              statusFlow={STATUS_FLOW}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export { formatCurrency };
