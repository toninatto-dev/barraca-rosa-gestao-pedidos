import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase'; // Ajuste o caminho se necessário

// Exemplo de tipagem (ajuste conforme os campos reais do seu banco)
type Order = {
  id: string;
  customer_name: string;
  total: number;
  status: string;
  created_at: string;
};

export function OrdersModule() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar os pedidos iniciais (usando useCallback para otimização)
  const fetchOrders = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('pedidos') // CONFIRME SE O NOME DA TABELA É 'pedidos' OU 'orders'
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setOrders(data);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 1. Faz a busca inicial ao abrir a página
    fetchOrders();

    // 2. Configura a escuta em tempo real 
    const channel = supabase
      .channel('realtime-pedidos')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'pedidos' // CONFIRME SE O NOME DA TABELA É ESTE MESMO
        },
        (payload) => {
          console.log('Novo pedido recebido!', payload);
          // Adiciona o pedido novo no topo da lista sem recarregar a página
          setOrders((currentOrders) => [payload.new as Order, ...currentOrders]);
        }
      )
      .subscribe();

    // 3. Limpeza do canal quando sair da tela
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOrders]);

  if (loading) {
    return <div className="p-4">Carregando pedidos...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Gestão de Pedidos</h2>
      
      {orders.length === 0 ? (
        <p className="text-gray-500">Nenhum pedido recebido ainda.</p>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div key={order.id} className="p-4 bg-white rounded-lg shadow border border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{order.customer_name}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-pink-600">
                    R$ {Number(order.total).toFixed(2)}
                  </p>
                  <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full mt-1">
                    {order.status || 'Novo'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default OrdersModule;