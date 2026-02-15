
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line 
} from 'recharts';
import { TrendingUp, TrendingDown, Users, Package, Wallet } from 'lucide-react';
import { Order, Expense, OrderStatus } from '../types';

interface DashboardProps {
  orders: Order[];
  expenses: Expense[];
}

const StatCard: React.FC<{ title: string, value: string, icon: React.ReactNode, color: string, sub: string }> = ({ title, value, icon, color, sub }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className={`${color} p-3 rounded-xl text-white shadow-lg shadow-indigo-100`}>
        {icon}
      </div>
      <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded-full uppercase">{sub}</span>
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium mb-1">{title}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ orders, expenses }) => {
  const stats = useMemo(() => {
    const revenue = orders.reduce((acc, o) => acc + o.totalPrice, 0);
    const exp = expenses.reduce((acc, e) => acc + e.amount, 0);
    const active = orders.filter(o => o.status === OrderStatus.PROCESSING || o.status === OrderStatus.PENDING).length;
    return {
      totalRevenue: revenue,
      totalExpenses: exp,
      netProfit: revenue - exp,
      activeOrders: active
    };
  }, [orders, expenses]);

  const chartData = [
    { name: 'Revenue', value: stats.totalRevenue, fill: '#6366f1' },
    { name: 'Expenses', value: stats.totalExpenses, fill: '#f43f5e' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Pendapatan" 
          value={`Rp ${stats.totalRevenue.toLocaleString('id-ID')}`} 
          icon={<Wallet size={24} />} 
          color="bg-indigo-600" 
          sub="Bulan Ini"
        />
        <StatCard 
          title="Pengeluaran" 
          value={`Rp ${stats.totalExpenses.toLocaleString('id-ID')}`} 
          icon={<TrendingDown size={24} />} 
          color="bg-rose-500" 
          sub="Operasional"
        />
        <StatCard 
          title="Laba Bersih" 
          value={`Rp ${stats.netProfit.toLocaleString('id-ID')}`} 
          icon={<TrendingUp size={24} />} 
          color="bg-emerald-500" 
          sub="Estimasi"
        />
        <StatCard 
          title="Pesanan Aktif" 
          value={stats.activeOrders.toString()} 
          icon={<Package size={24} />} 
          color="bg-amber-500" 
          sub="On-Progress"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Analisis Arus Kas</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `Rp${val/1000}k`} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Pesanan Terakhir</h3>
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{order.customerName}</p>
                  <p className="text-xs text-slate-500">{order.serviceType}</p>
                </div>
                <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                  order.status === OrderStatus.COMPLETED ? 'bg-green-100 text-green-700' :
                  order.status === OrderStatus.PROCESSING ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
                }`}>
                  {order.status}
                </div>
              </div>
            ))}
            {orders.length === 0 && <p className="text-center text-slate-400 py-10">Belum ada pesanan</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
