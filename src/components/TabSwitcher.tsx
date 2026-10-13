import { ShoppingBag, BarChart3 } from 'lucide-react';
import type { TabType } from '@/types';

interface TabSwitcherProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function TabSwitcher({ activeTab, onTabChange }: TabSwitcherProps) {
  return (
    <div
      className="inline-flex rounded-full bg-white p-1.5 shadow-md border-2 border-[#FBCFE8]"
      role="tablist"
      aria-label="Alternar entre Cardápio e Painel Administrativo"
    >
      <button
        role="tab"
        aria-selected={activeTab === 'menu'}
        aria-label="Ver Cardápio Digital"
        onClick={() => onTabChange('menu')}
        className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D10068]/30 ${
          activeTab === 'menu'
            ? 'bg-[#D10068] text-white shadow-lg scale-105'
            : 'text-[#D10068] hover:bg-[#FFF0F5]'
        }`}
      >
        <ShoppingBag className="h-4 w-4" aria-hidden="true" />
        Cardápio
      </button>
      <button
        role="tab"
        aria-selected={activeTab === 'admin'}
        aria-label="Ver Painel Administrativo"
        onClick={() => onTabChange('admin')}
        className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D10068]/30 ${
          activeTab === 'admin'
            ? 'bg-[#D10068] text-white shadow-lg scale-105'
            : 'text-[#D10068] hover:bg-[#FFF0F5]'
        }`}
      >
        <BarChart3 className="h-4 w-4" aria-hidden="true" />
        Painel Administrativo
      </button>
    </div>
  );
}
