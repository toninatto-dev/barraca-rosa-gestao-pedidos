import { useState, type FormEvent } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { categories } from '@/data/menu';
import { useMenuItems } from '@/hooks/useMenuItems';
import type { Category, MenuItem } from '@/types';

const inputClass =
  'rounded-xl border-2 border-[#FBCFE8] px-3 py-2 font-normal text-gray-800 outline-none focus:border-[#D10068]';
const labelClass = 'flex flex-col gap-1 text-sm font-semibold text-[#9D174D]';

const formatPrice = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export function MenuManager() {
  const { items, loading, refresh } = useMenuItems();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<Category>(categories[0]);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    const parsedPrice = Number(price.replace(',', '.'));
    if (!name.trim() || !Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setMessage({ type: 'error', text: 'Informe nome e preço válidos.' });
      return;
    }
    setSaving(true);
    setMessage(null);
    const { error } = await supabase.from('menu_items').insert({
      name: name.trim(),
      description: description.trim(),
      price: Math.round(parsedPrice * 100) / 100,
      category,
      is_new: isNew,
    });
    setSaving(false);
    if (error) {
      setMessage({ type: 'error', text: 'Não foi possível adicionar o item.' });
      return;
    }
    setName('');
    setDescription('');
    setPrice('');
    setIsNew(false);
    setMessage({ type: 'ok', text: 'Item adicionado ao cardápio.' });
    refresh();
  };

  const handleDelete = async (item: MenuItem) => {
    if (!window.confirm(`Excluir "${item.name}" do cardápio?`)) return;
    setDeletingId(item.id);
    const { error } = await supabase.from('menu_items').delete().eq('id', item.id);
    setDeletingId(null);
    if (error) {
      setMessage({ type: 'error', text: 'Não foi possível excluir o item.' });
      return;
    }
    setMessage({ type: 'ok', text: 'Item excluído.' });
    refresh();
  };

  return (
    <section
      aria-labelledby="menu-manager-title"
      className="space-y-5 rounded-2xl border-2 border-[#FBCFE8] bg-white p-6 shadow-sm"
    >
      <h2 id="menu-manager-title" className="text-lg font-bold text-[#D10068]">
        Gerenciar Cardápio
      </h2>

      <form onSubmit={handleAdd} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className={labelClass}>
          Nome
          <input
            required
            maxLength={80}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Preço (R$)
          <input
            required
            inputMode="decimal"
            placeholder="0,00"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className={`${labelClass} md:col-span-2`}>
          Descrição
          <input
            maxLength={240}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Categoria
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className={inputClass}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-end justify-between gap-4">
          <label className="flex items-center gap-2 pb-2 text-sm font-semibold text-[#9D174D]">
            <input
              type="checkbox"
              checked={isNew}
              onChange={(e) => setIsNew(e.target.checked)}
              className="h-4 w-4 accent-[#D10068]"
            />
            Marcar como novidade
          </label>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-[#D10068] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#E63970] disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Plus className="h-4 w-4" aria-hidden="true" />
            )}
            Adicionar item
          </button>
        </div>
      </form>

      {message && (
        <p
          role="status"
          className={`text-sm font-medium ${message.type === 'ok' ? 'text-green-700' : 'text-red-600'}`}
        >
          {message.text}
        </p>
      )}

      {loading ? (
        <div className="flex justify-center py-6 text-[#D10068]">
          <Loader2 className="h-5 w-5 animate-spin" aria-label="Carregando itens" />
        </div>
      ) : (
        <div className="space-y-5">
          {categories.map((cat) => {
            const catItems = items.filter((i) => i.category === cat);
            return (
              <div key={cat}>
                <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-[#9D174D]">
                  {cat} ({catItems.length})
                </h3>
                {catItems.length === 0 ? (
                  <p className="text-sm text-[#9D174D]/60">Nenhum item.</p>
                ) : (
                  <ul className="divide-y divide-[#FBCFE8] rounded-xl border border-[#FBCFE8]">
                    {catItems.map((item) => (
                      <li key={item.id} className="flex items-center justify-between gap-3 px-4 py-3">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-gray-800">
                            {item.name}
                            {item.isNew && (
                              <span className="ml-2 rounded-full bg-[#FFF0F5] px-2 py-0.5 text-xs font-bold text-[#D10068]">
                                Novo
                              </span>
                            )}
                          </p>
                          <p className="truncate text-xs text-gray-500">{item.description}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          <span className="text-sm font-bold text-[#D10068]">
                            {formatPrice(item.price)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            disabled={deletingId === item.id}
                            aria-label={`Excluir ${item.name}`}
                            className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                          >
                            {deletingId === item.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                            ) : (
                              <Trash2 className="h-4 w-4" aria-hidden="true" />
                            )}
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
