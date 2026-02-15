
import React, { useState } from 'react';
import { Plus, Wallet, TrendingDown, FileText, Calendar } from 'lucide-react';
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
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-3xl shadow-xl text-white">
          <p className="text-indigo-100 text-sm font-medium mb-1">Total Pendapatan</p>
          <p className="text-3xl font-bold">Rp {totalRevenue.toLocaleString('id-ID')}</p>
          <div className="mt-4 pt-4 border-t border-white/20 flex items-center space-x-2 text-xs text-indigo-100">
            <Calendar size={14} />
            <span>Rekapitulasi Semua Transaksi</span>
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <p className="text-slate-500 text-sm font-medium mb-1">Total Pengeluaran</p>
          <p className="text-3xl font-bold text-rose-600">Rp {totalExpenses.toLocaleString('id-ID')}</p>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center space-x-2 text-xs text-slate-400">
            <TrendingDown size={14} />
            <span>Pengeluaran Operasional</span>
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <p className="text-slate-500 text-sm font-medium mb-1">Laba / Rugi Bersih</p>
          <p className={`text-3xl font-bold ${netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            Rp {netProfit.toLocaleString('id-ID')}
          </p>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center space-x-2 text-xs text-slate-400">
            <FileText size={14} />
            <span>Margin Keuntungan</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">Daftar Pengeluaran</h3>
          <button 
            onClick={() => setIsAdding(true)}
            className="text-indigo-600 flex items-center space-x-1 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors font-semibold text-sm"
          >
            <Plus size={16} />
            <span>Tambah Catatan</span>
          </button>
        </div>

        {isAdding && (
          <form onSubmit={handleSubmit} className="p-6 bg-slate-50 border-b border-slate-100 animate-in slide-in-from-top duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input 
                type="text" 
                placeholder="Kategori (e.g. Sabun, Listrik)" 
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                required
              />
              <input 
                type="number" 
                placeholder="Jumlah (Rp)" 
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm"
                value={formData.amount || ''}
                onChange={e => setFormData({...formData, amount: Number(e.target.value)})}
                required
              />
              <input 
                type="text" 
                placeholder="Keterangan" 
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button type="button" onClick={() => setIsAdding(false)} className="text-slate-500 text-sm font-medium px-4 py-2 hover:bg-slate-200 rounded-xl transition-colors">Batal</button>
              <button type="submit" className="bg-indigo-600 text-white text-sm font-semibold px-6 py-2 rounded-xl hover:bg-indigo-700 shadow-md">Simpan Pengeluaran</button>
            </div>
          </form>
        )}

        <div className="divide-y divide-slate-50">
          {expenses.map((exp) => (
            <div key={exp.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-rose-50 text-rose-500 rounded-2xl">
                  <TrendingDown size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-800">{exp.category}</p>
                  <p className="text-xs text-slate-500">{exp.description} &bull; {new Date(exp.date).toLocaleDateString()}</p>
                </div>
              </div>
              <p className="font-bold text-rose-600 text-lg">- Rp {exp.amount.toLocaleString('id-ID')}</p>
            </div>
          ))}
          {expenses.length === 0 && (
            <div className="py-20 text-center text-slate-400">
              <FileText size={48} strokeWidth={1} className="mx-auto mb-4" />
              <p>Belum ada catatan pengeluaran</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Finance;
