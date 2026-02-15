
import React from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Check, 
  Truck, 
  Loader2, 
  Clock, 
  Package,
  RefreshCcw,
  CheckCircle2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Order, OrderStatus, WaStatus } from '../types';

interface OrderListProps {
  orders: Order[];
  updateStatus: (id: string, status: OrderStatus) => void;
  checkWaStatus: (id: string) => void;
}

const WaStatusIndicator: React.FC<{ status?: WaStatus, onRefresh: () => void }> = ({ status, onRefresh }) => {
  if (!status) return null;

  const getStatusConfig = () => {
    switch (status) {
      case 'pending': return { icon: <Clock size={12} />, color: 'text-slate-400', label: 'Pending' };
      case 'sent': return { icon: <Check size={12} />, color: 'text-slate-500', label: 'Terkirim' };
      case 'delivered': return { icon: <CheckCircle2 size={12} />, color: 'text-indigo-500', label: 'Sampai' };
      case 'read': return { icon: <CheckCircle2 size={12} />, color: 'text-blue-500', label: 'Dibaca' };
      case 'failed': return { icon: <AlertCircle size={12} />, color: 'text-rose-500', label: 'Gagal' };
      default: return { icon: <Clock size={12} />, color: 'text-slate-400', label: status };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="flex items-center space-x-2 mt-1">
      <div className={`flex items-center space-x-1 ${config.color}`} title={config.label}>
        {config.icon}
        <span className="text-[10px] font-bold uppercase">{config.label}</span>
      </div>
      <button 
        onClick={(e) => { e.stopPropagation(); onRefresh(); }}
        className="p-1 hover:bg-slate-200 rounded-md text-slate-400 hover:text-indigo-600 transition-colors"
        title="Refresh Status WA"
      >
        <RefreshCcw size={10} />
      </button>
    </div>
  );
};

const OrderList: React.FC<OrderListProps> = ({ orders, updateStatus, checkWaStatus }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari pelanggan atau ID pesanan..." 
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
          />
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium hover:bg-slate-50 transition-colors">
            <Filter size={16} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-4">ID / Tanggal</th>
              <th className="px-6 py-4">Pelanggan</th>
              <th className="px-6 py-4">Layanan</th>
              <th className="px-6 py-4">Berat (kg)</th>
              <th className="px-6 py-4">Status WA</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-indigo-600">#{order.id}</p>
                  <p className="text-[10px] text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-slate-800">{order.customerName}</p>
                  <p className="text-xs text-slate-500">{order.phoneNumber}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold">
                    {order.serviceType}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{order.weight} kg</td>
                <td className="px-6 py-4">
                   <WaStatusIndicator status={order.waStatus} onRefresh={() => checkWaStatus(order.id)} />
                </td>
                <td className="px-6 py-4 font-bold text-slate-800 text-sm">
                  Rp {order.totalPrice.toLocaleString('id-ID')}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.status === OrderStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                    order.status === OrderStatus.PROCESSING ? 'bg-blue-100 text-blue-800' :
                    order.status === OrderStatus.COMPLETED ? 'bg-green-100 text-green-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {order.status === OrderStatus.PROCESSING && <Loader2 size={12} className="mr-1 animate-spin" />}
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center space-x-2">
                    {order.status === OrderStatus.PENDING && (
                      <button 
                        onClick={() => updateStatus(order.id, OrderStatus.PROCESSING)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Loader2 size={18} />
                      </button>
                    )}
                    {order.status === OrderStatus.PROCESSING && (
                      <button 
                        onClick={() => updateStatus(order.id, OrderStatus.COMPLETED)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Check size={18} />
                      </button>
                    )}
                    {order.status === OrderStatus.COMPLETED && (
                      <button 
                        onClick={() => updateStatus(order.id, OrderStatus.PICKED_UP)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Truck size={18} />
                      </button>
                    )}
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Package size={48} strokeWidth={1} className="mb-4" />
            <p className="text-lg">Belum ada pesanan masuk</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
