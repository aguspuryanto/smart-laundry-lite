import React from 'react';
import { Package, Plus, LogOut } from 'lucide-react';

interface HeaderProps {
  activeTab: 'dashboard' | 'orders' | 'finance' | 'settings';
  onNewOrder: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onNewOrder, onLogout }) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Overview';
      case 'orders': return 'Pesanan';
      case 'finance': return 'Keuangan';
      case 'settings': return 'Pengaturan';
      default: return 'Overview';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 shadow-sm">
      {/* Mobile Logo */}
      <div className="flex items-center space-x-3 md:hidden">
        <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
          <Package size={18} />
        </div>
        <span className="font-bold text-lg text-slate-800 tracking-tight">Smart Laundry</span>
      </div>

      {/* Desktop Title */}
      <h1 className="hidden md:block text-xl font-bold text-slate-800 uppercase tracking-wide">
        {getTabTitle()}
      </h1>

      {/* Actions */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {activeTab !== 'settings' && (
          <button 
            onClick={onNewOrder}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg flex items-center space-x-2 shadow-md transition-all active:scale-95 text-sm md:text-base"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Order Baru</span>
            <span className="sm:hidden">Order</span>
          </button>
        )}
        <button 
          onClick={onLogout}
          className="md:hidden p-2 text-slate-400 hover:text-red-500 transition-colors"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
