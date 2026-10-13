import { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Order } from '@/types';
import { OrdersModule } from './OrdersModule';
import { Dashboard } from './Dashboard';

export function AdminPanel() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = useCallback(async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    setOrders((data ?? []) as Order[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders, refreshKey]);

  const handleOrderUpdated = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4">
      <div className="rounded-2xl bg-gradient-to-r from-[#D10068] to-[#E63970] px-6 py-4 text-white shadow-md">
        <h1 className="text-xl font-bold">
          Painel da Thais ♡
        </h1>
        <p className="text-sm text-white/80">
          Gestão de pedidos e análise de vendas
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-[#D10068]">
          <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
        </div>
      ) : (
        <>
          <Dashboard orders={orders} />
          <OrdersModule
            refreshKey={refreshKey}
            onOrderUpdated={handleOrderUpdated}
          />
        </>
      )}
    </div>
  );
}
