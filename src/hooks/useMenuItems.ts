import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Category, MenuItem } from '@/types';

interface MenuItemRow {
  id: string;
  name: string;
  description: string;
  price: number | string;
  category: Category;
  is_new: boolean;
}

function toMenuItem(row: MenuItemRow): MenuItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    category: row.category,
    isNew: row.is_new,
  };
}

export function useMenuItems() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const { data, error: err } = await supabase
      .from('menu_items')
      .select('id, name, description, price, category, is_new')
      .order('created_at', { ascending: true });
    if (err) {
      setError('Não foi possível carregar o cardápio.');
    } else {
      setError(null);
      setItems(((data ?? []) as MenuItemRow[]).map(toMenuItem));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { items, loading, error, refresh };
}
