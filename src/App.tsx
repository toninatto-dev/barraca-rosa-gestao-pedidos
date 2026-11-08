import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { TabSwitcher } from '@/components/TabSwitcher';
import { DigitalMenu } from '@/components/DigitalMenu';
import { FloatingCart } from '@/components/FloatingCart';
import { CheckoutModal } from '@/components/CheckoutModal';
import { AdminPanel } from '@/components/AdminPanel';
import { useCart } from '@/hooks/useCart';
import type { TabType, CartItem } from '@/types';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('menu');
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const { cart, addItem, removeItem, clearCart, total, totalItems } = useCart();

  return (
    <div className="min-h-screen bg-[#FFF0F5] flex flex-col">
      <Header />

      <div className="sticky top-0 z-30 bg-[#FFF0F5]/90 backdrop-blur-sm py-4 px-4 flex justify-center border-b border-[#FBCFE8]/50">
        <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <main className="flex-1 py-8">
        {activeTab === 'menu' ? (
          <DigitalMenu cart={cart} onAdd={addItem} onRemove={removeItem} />
        ) : (
          <AdminPanel />
        )}
      </main>

      <Footer />

      {activeTab === 'menu' && (
        <>
          <FloatingCart cart={cart} onCheckout={() => setCheckoutOpen(true)} />
          <CheckoutModal
            open={checkoutOpen}
            cart={cart}
            onClose={() => setCheckoutOpen(false)}
            onClearCart={clearCart}
            onRemoveItem={removeItem}
            onAddItem={(item: CartItem) => addItem(item)}
          />
        </>
      )}
    </div>
  );
}

export default App;
