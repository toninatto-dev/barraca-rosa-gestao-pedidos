import { useState, useEffect, useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Loader2, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Order } from '@/types';
import { OrdersModule } from './OrdersModule';
import { Dashboard } from './Dashboard';
import { AdminLogin } from './AdminLogin';
import { MenuManager } from './MenuManager';

type AdminView = 'orders' | 'menu';

export function AdminPanel() {
  const [session, setSession] = useState<Session | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCheckingSession(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (checkingSession) {
    return (
      <div className="flex items-center justify-center py-12 text-[#D10068]">
        <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
      </div>
    );
  }

  if (!session) return <AdminLogin />;

  return <AdminDashboard />;
}

function AdminDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<AdminView>('orders');

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
      <div className="flex items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-[#D10068] to-[#E63970] px-6 py-4 text-white shadow-md">
        <div>
          <h1 className="text-xl font-bold">
            Painel da Thais ♡
          </h1>
          <p className="text-sm text-white/80">
            Gestão de pedidos, cardápio e análise de vendas
          </p>
        </div>
        <button
          type="button"
          onClick={() => supabase.auth.signOut()}
          className="flex items-center gap-2 rounded-xl bg-white/15 px-3 py-2 text-sm font-semibold transition-colors hover:bg-white/25"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Sair
        </button>
      </div>

      <div role="tablist" aria-label="Seções do painel" className="flex gap-3">
        {([
          ['orders', 'Pedidos e Vendas'],
          ['menu', 'Cardápio'],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            role="tab"
            aria-selected={view === key}
            onClick={() => setView(key)}
            className={`rounded-full px-5 py-2 text-sm font-bold transition-colors ${
              view === key
                ? 'bg-[#D10068] text-white shadow'
                : 'border-2 border-[#FBCFE8] bg-white text-[#D10068] hover:border-[#E63970]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {view === 'menu' ? (
        <MenuManager />
      ) : loading ? (
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
