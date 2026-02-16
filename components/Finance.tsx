
import React, { useState } from 'react';
import { Plus, Wallet, TrendingDown, FileText, Calendar, X } from 'lucide-react';
import { Order, Expense } from '../types';

interface FinanceProps {
  orders: Order[];
  expenses: Expense[];
  addExpense: (exp: Omit<Expense, 'id' | 'date'>) => void;
}

const Finance: React.FC<FinanceProps> = ({ orders, expenses, addExpense }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ category: '', amount: 0, description: '' });

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount > 0 && formData.category) {
      addExpense(formData);
      setIsAdding(false);
      setFormData({ category: '', amount: 0, description: '' });
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 max-w-5xl mx-auto">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-indigo-600 p-6 md:p-8 rounded-3xl shadow-lg text-white">
          <p className="text-indigo-100 text-xs md:text-sm font-medium mb-1">Total Pendapatan</p>
          <p className="text-2xl md:text-3xl font-bold">Rp {totalRevenue.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
          <p className="text-slate-500 text-xs md:text-sm font-medium mb-1">Total Pengeluaran</p>
          <p className="text-2xl md:text-3xl font-bold text-rose-600">Rp {totalExpenses.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 sm:col-span-2 lg:col-span-1">
          <p className="text-slate-500 text-xs md:text-sm font-medium mb-1">Laba Bersih</p>
          <p className={`text-2xl md:text-3xl font-bold ${netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            Rp {netProfit.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 md:p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base md:text-lg font-bold text-slate-800">Catatan Pengeluaran</h3>
          {!isAdding && (
            <button 
              onClick={() => setIsAdding(true)}
              className="text-indigo-600 flex items-center space-x-1 hover:bg-indigo-50 px-3 py-1.5 rounded-xl transition-colors font-bold text-sm"
            >
              <Plus size={16} />
              <span>Tambah</span>
            </button>
          )}
        </div>

        {isAdding && (
          <form onSubmit={handleSubmit} className="p-5 md:p-6 bg-slate-50 border-b border-slate-100 animate-in slide-in-from-top duration-300">
            <div className="flex justify-between items-center mb-4">
               <h4 className="text-sm font-bold text-slate-700">Input Baru</h4>
               <button type="button" onClick={() => setIsAdding(false)} className="text-slate-400 p-1"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="Kategori (e.g. Listrik, Sabun)" 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                required
              />
              <input 
                type="number" 
                placeholder="Jumlah (Rp)" 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
                value={formData.amount || ''}
                onChange={e => setFormData({...formData, amount: Number(e.target.value)})}
                required
              />
              <textarea 
                placeholder="Keterangan opsional" 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 md:col-span-2"
                rows={2}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <button type="submit" className="w-full bg-indigo-600 text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all order-1 sm:order-2">Simpan Catatan</button>
            </div>
          </form>
        )}

        <div className="divide-y divide-slate-50">
          {expenses.map((exp) => (
            <div key={exp.id} className="p-5 md:p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center space-x-4 overflow-hidden">
                <div className="p-2.5 bg-rose-50 text-rose-500 rounded-xl shrink-0">
                  <TrendingDown size={18} />
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-slate-800 text-sm md:text-base truncate">{exp.category}</p>
                  <p className="text-[10px] md:text-xs text-slate-500 truncate">{exp.description || 'Tanpa ket.'} • {new Date(exp.date).toLocaleDateString()}</p>
                </div>
              </div>
              <p className="font-bold text-rose-600 text-sm md:text-lg shrink-0">- Rp {exp.amount.toLocaleString('id-ID')}</p>
            </div>
          ))}
          {expenses.length === 0 && (
            <div className="py-16 text-center text-slate-400">
              <FileText size={40} strokeWidth={1} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Belum ada catatan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Finance;
