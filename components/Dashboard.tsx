
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { TrendingUp, Package, Wallet, MessageCircle } from 'lucide-react';
import { Order, Expense, OrderStatus } from '../types';

interface DashboardProps {
  orders: Order[];
  expenses: Expense[];
}

const StatCard: React.FC<{ title: string, value: string, icon: React.ReactNode, color: string, sub: string }> = ({ title, value, icon, color, sub }) => (
  <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className={`${color} p-2.5 md:p-3 rounded-xl text-white shadow-lg shadow-indigo-100`}>
        {React.cloneElement(icon as React.ReactElement, { size: 20 })}
      </div>
      <span className="text-[10px] md:text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded-full uppercase tracking-tighter md:tracking-normal">{sub}</span>
    </div>
    <div>
      <p className="text-xs md:text-sm text-slate-500 font-medium mb-1 truncate">{title}</p>
      <p className="text-xl md:text-2xl font-bold text-slate-800 break-words">{value}</p>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ orders, expenses }) => {
  const stats = useMemo(() => {
    const revenue = orders.reduce((acc, o) => acc + o.totalPrice, 0);
    const exp = expenses.reduce((acc, e) => acc + e.amount, 0);
    const active = orders.filter(o => o.status === OrderStatus.PROCESSING || o.status === OrderStatus.PENDING).length;
    const readMessages = orders.filter(o => o.waStatus === 'read').length;
    
    return {
      totalRevenue: revenue,
      totalExpenses: exp,
      netProfit: revenue - exp,
      activeOrders: active,
      readMessages
    };
  }, [orders, expenses]);

  const chartData = [
    { name: 'Revenue', value: stats.totalRevenue, fill: '#6366f1' },
    { name: 'Expenses', value: stats.totalExpenses, fill: '#f43f5e' },
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <StatCard 
          title="Pendapatan" 
          value={`Rp ${stats.totalRevenue.toLocaleString('id-ID')}`} 
          icon={<Wallet />} 
          color="bg-indigo-600" 
          sub="Bulan Ini"
        />
        <StatCard 
          title="Laba Bersih" 
          value={`Rp ${stats.netProfit.toLocaleString('id-ID')}`} 
          icon={<TrendingUp />} 
          color="bg-emerald-500" 
          sub="Estimasi"
        />
        <StatCard 
          title="WA Dibaca" 
          value={stats.readMessages.toString()} 
          icon={<MessageCircle />} 
          color="bg-blue-500" 
          sub="Engagement"
        />
        <StatCard 
          title="Aktif" 
          value={stats.activeOrders.toString()} 
          icon={<Package />} 
          color="bg-amber-500" 
          sub="On-Progress"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-base md:text-lg font-bold text-slate-800 mb-6">Analisis Arus Kas</h3>
          <div className="h-64 md:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} tickFormatter={(val) => `Rp${val/1000}k`} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }} 
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-base md:text-lg font-bold text-slate-800 mb-4">Aktivitas Terbaru</h3>
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-slate-800 truncate">{order.customerName}</p>
                  <p className="text-[10px] text-slate-500">WA: {order.waStatus || 'None'}</p>
                </div>
                <div className={`shrink-0 px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
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
