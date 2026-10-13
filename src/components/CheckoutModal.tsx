import { useState, useEffect, useRef } from 'react';
import { X, ShoppingBag, Send, Trash2, Plus, Minus } from 'lucide-react';
import type { CartItem } from '@/types';
import { formatCurrency } from '@/lib/cart';

interface CheckoutModalProps {
  open: boolean;
  cart: CartItem[];
  onClose: () => void;
  onClearCart: () => void;
  onRemoveItem: (id: string) => void;
  onAddItem: (item: CartItem) => void;
}

const WHATSAPP_NUMBER = '5517999999999';

export function CheckoutModal({
  open,
  cart,
  onClose,
  onClearCart,
  onRemoveItem,
  onAddItem,
}: CheckoutModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      setSubmitted(false);
    }
  }, [open]);

  if (!open) return null;

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;

    const lines = cart.map(
      (i) => `• ${i.quantity}x ${i.name} — ${formatCurrency(i.price * i.quantity)}`
    );
    const msg =
      `*Pedido — A BARRACA ROSA ♡*\n\n` +
      `Cliente: ${customerName}\n\n` +
      `*Itens:*\n${lines.join('\n')}\n\n` +
      `*Total: ${formatCurrency(total)}*\n` +
      (notes.trim() ? `\nObservação: ${notes}\n` : '') +
      `\nObrigada pelo pedido! ♡`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');

    setSubmitted(true);
    setCustomerName('');
    setNotes('');
    onClearCart();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Finalizar pedido"
    >
      <div
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between rounded-t-3xl bg-gradient-to-r from-[#D10068] to-[#E63970] px-6 py-4 text-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            <h2 className="text-lg font-bold">Finalizar Pedido</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar modal"
            className="rounded-full p-1.5 hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {submitted ? (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF0F5] text-3xl">
              ♡
            </div>
            <h3 className="text-xl font-bold text-gray-800">
              Pedido enviado!
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Sua mensagem foi enviada para o WhatsApp da Barraca Rosa.
            </p>
            <button
              onClick={onClose}
              className="mt-6 rounded-xl bg-[#D10068] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#E63970] transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D10068]/30"
            >
              Fechar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
            {cart.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Seu carrinho está vazio.
              </p>
            ) : (
              <>
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-gray-700">
                    Seus itens
                  </h3>
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-xl border border-[#FBCFE8] bg-[#FFF0F5]/50 p-3"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-800">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatCurrency(item.price)} cada
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          aria-label={`Remover uma unidade de ${item.name}`}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[#D10068] shadow-sm hover:bg-[#FBCFE8] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D10068]/30"
                        >
                          <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                        <span className="min-w-[1.5rem] text-center text-sm font-bold text-[#D10068]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onAddItem(item)}
                          aria-label={`Adicionar uma unidade de ${item.name}`}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[#D10068] shadow-sm hover:bg-[#FBCFE8] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D10068]/30"
                        >
                          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            for (let i = 0; i < item.quantity; i++) {
                              onRemoveItem(item.id);
                            }
                          }}
                          aria-label={`Remover ${item.name} do carrinho`}
                          className="ml-1 flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-200"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                      <p className="w-20 text-right text-sm font-bold text-[#D10068]">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl bg-[#FFF0F5] p-4 text-right">
                  <span className="text-sm text-gray-600">Total: </span>
                  <span className="text-xl font-black text-[#D10068]">
                    {formatCurrency(total)}
                  </span>
                </div>

                <div>
                  <label
                    htmlFor="customer-name"
                    className="mb-1.5 block text-sm font-bold text-gray-700"
                  >
                    Seu nome <span className="text-[#E63970]">*</span>
                  </label>
                  <input
                    ref={nameInputRef}
                    id="customer-name"
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Digite seu nome"
                    className="w-full rounded-xl border-2 border-[#FBCFE8] px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#E63970] focus:outline-none focus:ring-2 focus:ring-[#E63970]/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="notes"
                    className="mb-1.5 block text-sm font-bold text-gray-700"
                  >
                    Observação
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Alguma observação para seu pedido?"
                    className="w-full rounded-xl border-2 border-[#FBCFE8] px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#E63970] focus:outline-none focus:ring-2 focus:ring-[#E63970]/20 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D10068] px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#E63970] hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D10068]/30 active:scale-95"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  Enviar pedido pelo WhatsApp
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
