export type Category = 'Café e Lanches' | 'Sabores que Encantam' | 'Bebidas';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  isNew?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export type OrderStatus = 'Pendente' | 'Em Preparo' | 'Concluído';

export interface Order {
  id: string;
  customer_name: string;
  items: CartItem[];
  total: number;
  notes: string;
  status: OrderStatus;
  created_at: string;
}

export type TabType = 'menu' | 'admin';
