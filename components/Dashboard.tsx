
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { TrendingUp, Package, Wallet, MessageCircle, ArrowUp, ArrowDown, Activity, Users } from 'lucide-react';
import { Order, Expense, OrderStatus } from '../types';

interface DashboardProps {
  orders: Order[];
  expenses: Expense[];
}

const StatCard: React.FC<{ 
  title: string, 
  value: string, 
  icon: React.ReactNode, 
  color: string, 
  sub: string,
  trend?: 'up' | 'down' | 'neutral',
  trendValue?: string
}> = ({ title, value, icon, color, sub, trend = 'neutral', trendValue }) => (
  <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg border border-slate-100/50 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
    {/* Background Gradient */}
    <div className={`absolute inset-0 opacity-5 bg-gradient-to-br ${color} group-hover:opacity-10 transition-opacity duration-300`} />
    
    <div className="relative p-6 flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-4">
        <div className={`${color} p-3 rounded-xl text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
          {React.cloneElement(icon as React.ReactElement, { size: 20 })}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-semibold text-slate-500 bg-slate-50 px-2 py-1 rounded-full uppercase tracking-tighter">
            {sub}
          </span>
          {trendValue && (
            <div className={`flex items-center space-x-1 text-xs font-medium mt-1 ${
              trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'text-slate-500'
            }`}>
              {trend === 'up' ? <ArrowUp size={12} /> : trend === 'down' ? <ArrowDown size={12} /> : null}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
      </div>
      <div>
        <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wide">{title}</p>
        <p className="text-2xl font-bold text-slate-900 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          {value}
        </p>
      </div>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ orders, expenses }) => {
  const stats = useMemo(() => {
    const revenue = orders.reduce((acc, o) => acc + o.totalPrice, 0);
    const exp = expenses.reduce((acc, e) => acc + e.amount, 0);
    const active = orders.filter(o => o.status === OrderStatus.PROCESSING || o.status === OrderStatus.PENDING).length;
    const readMessages = orders.filter(o => o.waStatus === 'read').length;
    const completed = orders.filter(o => o.status === OrderStatus.COMPLETED).length;
    
    // Calculate trends (mock data for demonstration)
    const revenueTrend = revenue > 0 ? 'up' : 'neutral';
    const profitTrend = (revenue - exp) > 0 ? 'up' : 'down';
    
    return {
      totalRevenue: revenue,
      totalExpenses: exp,
      netProfit: revenue - exp,
      activeOrders: active,
      readMessages,
      completedOrders: completed,
      revenueTrend,
      profitTrend
    };
  }, [orders, expenses]);

  const chartData = [
    { name: 'Pendapatan', value: stats.totalRevenue, fill: '#6366f1' },
    { name: 'Pengeluaran', value: stats.totalExpenses, fill: '#f43f5e' },
  ];

  const recentActivity = orders.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 md:p-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard Overview</h1>
        <p className="text-slate-600">Monitor performa bisnis laundry Anda secara real-time</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Pendapatan" 
          value={`Rp ${stats.totalRevenue.toLocaleString('id-ID')}`} 
          icon={<Wallet />} 
          color="bg-gradient-to-r from-indigo-600 to-indigo-700" 
          sub="Bulan Ini"
          trend={stats.revenueTrend}
          trendValue="+12.5%"
        />
        <StatCard 
          title="Laba Bersih" 
          value={`Rp ${stats.netProfit.toLocaleString('id-ID')}`} 
          icon={<TrendingUp />} 
          color="bg-gradient-to-r from-emerald-500 to-emerald-600" 
          sub="Estimasi"
          trend={stats.profitTrend}
          trendValue="+8.3%"
        />
        <StatCard 
          title="Pesanan Aktif" 
          value={stats.activeOrders.toString()} 
          icon={<Package />} 
          color="bg-gradient-to-r from-amber-500 to-amber-600" 
          sub="Sedang Berjalan"
        />
        <StatCard 
          title="WA Terbaca" 
          value={stats.readMessages.toString()} 
          icon={<MessageCircle />} 
          color="bg-gradient-to-r from-blue-500 to-blue-600" 
          sub="Engagement Rate"
        />
      </div>

      {/* Charts and Activity Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Enhanced Chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-lg border border-slate-100/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Analisis Keuangan</h3>
            <div className="flex items-center space-x-2 text-sm text-slate-500">
              <Activity size={16} className="text-indigo-600" />
              <span>Real-time</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  tickFormatter={(val) => `Rp${(val/1000000).toFixed(1)}jt`} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc', radius: 8 }}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', 
                    fontSize: '13px',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
                  }}
                  formatter={(value, name) => [`Rp ${value.toLocaleString('id-ID')}`, name]}
                />
                <Bar 
                  dataKey="value" 
                  radius={[12, 12, 0, 0]} 
                  barSize={60}
                  fillOpacity={0.9}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Enhanced Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Aktivitas Terbaru</h3>
            <div className="bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full">
              {orders.length} Total
            </div>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recentActivity.length > 0 ? (
              recentActivity.map((order, index) => (
                <div 
                  key={order.id} 
                  className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-50 to-white border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-sm font-semibold text-slate-900 truncate">{order.customerName}</p>
                      <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        order.status === OrderStatus.COMPLETED ? 'bg-emerald-100 text-emerald-700' :
                        order.status === OrderStatus.PROCESSING ? 'bg-blue-100 text-blue-700' : 
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {order.status}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-slate-500">
                      <span>ID: {order.id.slice(-8)}</span>
                      <span>Rp {order.totalPrice.toLocaleString('id-ID')}</span>
                      {order.waStatus && (
                        <span className={`flex items-center space-x-1 ${
                          order.waStatus === 'read' ? 'text-emerald-600' : 
                          order.waStatus === 'sent' ? 'text-blue-600' : 'text-slate-400'
                        }`}>
                          <MessageCircle size={12} />
                          {order.waStatus}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Package size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 font-medium">Belum ada aktivitas</p>
                <p className="text-slate-400 text-sm mt-1">Pesanan pertama akan muncul di sini</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
