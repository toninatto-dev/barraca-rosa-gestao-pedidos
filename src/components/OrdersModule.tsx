
import { useState, useEffect } from 'react';
import { Clock, PackageCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatCurrency } from '@/lib/cart';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  items: OrderItem[];
  total: number;
  status: 'Pendente' | 'Em Preparo' | 'Pronto' | 'Entregue' | 'Cancelado';
  notes?: string;
}

const STATUS_OPTIONS: Order['status'][] = [
  'Pendente',
  'Em Preparo',
  'Pronto',
  'Entregue',
  'Cancelado',
];

const STATUS_COLORS: Record<Order['status'], string> = {
  Pendente: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'Em Preparo': 'bg-blue-100 text-blue-800 border-blue-300',
  Pronto: 'bg-[#FFF0F5] text-[#D10068] border-[#FBCFE8]',
  Entregue: 'bg-green-100 text-green-800 border-green-300',
  Cancelado: 'bg-red-100 text-red-800 border-red-300',
};

export function OrdersModule() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar pedidos:', error);
      } else {
        setOrders((data as Order[]) || []);
      }
    } catch (err) {
      console.error('Erro inesperado:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      setUpdatingId(orderId);

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );

      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) {
        console.error('Erro ao atualizar status:', error);
        fetchOrders();
      }
    } catch (err) {
      console.error('Erro inesperado:', err);
      fetchOrders();
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel('orders_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 space-y-6 bg-white min-h-[60vh] rounded-3xl shadow-sm">
      <div className="flex items-center justify-between border-b border-pink-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2">
            <PackageCheck className="h-7 w-7 text-[#D10068]" />
            Gestão de Pedidos
          </h1>
          <p className="text-sm text-gray-500">
            Acompanhe e altere o status dos pedidos recebidos.
          </p>
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-white border-2 border-[#FBCFE8] px-4 py-2 text-sm font-bold text-[#D10068] hover:bg-[#FFF0F5] transition-colors focus-visible:outline-none"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>

      {loading && orders.length === 0 ? (
        <div className="py-12 text-center text-gray-500 space-y-3">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-[#D10068]" />
          <p>Carregando pedidos...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center text-gray-500">
          <AlertCircle className="mx-auto h-10 w-10 text-gray-400 mb-2" />
          <p className="font-bold text-gray-700">Nenhum pedido recebido ainda</p>
          <p className="text-xs text-gray-400 mt-1">
            Os pedidos realizados no checkout aparecerão automaticamente aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border-2 border-[#FBCFE8] bg-white p-5 shadow-sm space-y-4 transition-all hover:shadow-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-gray-800">
                    {order.customer_name}
                  </h3>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(order.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={order.status || 'Pendente'}
                    disabled={updatingId === order.id}
                    onChange={(e) =>
                      handleStatusChange(
                        order.id,
                        e.target.value as Order['status']
                      )
                    }
                    className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition-all focus:outline-none ${
                      STATUS_COLORS[order.status] ||
                      'bg-gray-100 text-gray-700 border-gray-300'
                    }`}
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st} className="bg-white text-gray-800">
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Itens do Pedido
                </p>
                <div className="rounded-xl bg-[#FFF0F5]/50 p-3 space-y-1">
                  {Array.isArray(order.items) &&
                    order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between text-sm text-gray-700"
                      >
                        <span>
                          <strong className="text-[#D10068]">
                            {item.quantity}x
                          </strong>{' '}
                          {item.name}
                        </span>
                        <span className="font-semibold text-gray-600">
                          {formatCurrency((item.price || 0) * (item.quantity || 1))}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {order.notes && (
                <div className="text-xs text-gray-600 bg-yellow-50 border border-yellow-200 rounded-xl p-2.5">
                  <strong className="text-yellow-800">Obs:</strong> {order.notes}
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-xs font-bold text-gray-500">Total</span>
                <span className="text-lg font-black text-[#D10068]">
                  {formatCurrency(order.total || 0)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersModule;