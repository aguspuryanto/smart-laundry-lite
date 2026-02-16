
import React, { useState } from 'react';
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
  AlertCircle,
  MessageSquareOff,
  User,
  Calendar,
  Weight
} from 'lucide-react';
import { Order, OrderStatus, WaStatus } from '../types';

interface OrderListProps {
  orders: Order[];
  updateStatus: (id: string, status: OrderStatus) => void;
  checkWaStatus: (id: string) => void;
  isWaEnabled: boolean;
}

const WaStatusIndicator: React.FC<{ status?: WaStatus, onRefresh: () => void, isEnabled: boolean }> = ({ status, onRefresh, isEnabled }) => {
  if (!isEnabled) return (
    <div className="flex items-center space-x-1 text-slate-300" title="Integrasi Mati">
      <MessageSquareOff size={12} />
      <span className="text-[10px] font-bold uppercase tracking-tight">Off</span>
    </div>
  );
  if (!status) return null;

  const getStatusConfig = () => {
    switch (status) {
      case 'pending': return { icon: <Clock size={12} />, color: 'text-slate-400', label: 'Pending' };
      case 'sent': return { icon: <Check size={12} />, color: 'text-slate-500', label: 'Sent' };
      case 'delivered': return { icon: <CheckCircle2 size={12} />, color: 'text-indigo-500', label: 'Delivered' };
      case 'read': return { icon: <CheckCircle2 size={12} />, color: 'text-blue-500', label: 'Read' };
      case 'failed': return { icon: <AlertCircle size={12} />, color: 'text-rose-500', label: 'Failed' };
      default: return { icon: <Clock size={12} />, color: 'text-slate-400', label: status };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="flex items-center space-x-2">
      <div className={`flex items-center space-x-1 ${config.color}`} title={config.label}>
        {config.icon}
        <span className="text-[10px] font-bold uppercase">{config.label}</span>
      </div>
      <button 
        onClick={(e) => { e.stopPropagation(); onRefresh(); }}
        className="p-1 hover:bg-slate-200 rounded-md text-slate-400 hover:text-indigo-600 transition-colors"
      >
        <RefreshCcw size={10} />
      </button>
    </div>
  );
};

const OrderList: React.FC<OrderListProps> = ({ orders, updateStatus, checkWaStatus, isWaEnabled }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter(o => 
    o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusClass = (status: OrderStatus) => {
    switch(status) {
      case OrderStatus.PENDING: return 'bg-yellow-100 text-yellow-800';
      case OrderStatus.PROCESSING: return 'bg-blue-100 text-blue-800';
      case OrderStatus.COMPLETED: return 'bg-green-100 text-green-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari ID atau Pelanggan..." 
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium hover:bg-slate-50 active:scale-95 transition-all">
          <Filter size={16} />
          <span>Filter</span>
        </button>
      </div>

      {/* Mobile & Tablet Card View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-wider mb-1 inline-block">#{order.id}</span>
                <h4 className="text-base font-bold text-slate-800">{order.customerName}</h4>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusClass(order.status)}`}>
                {order.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center space-x-2 text-slate-500">
                <Weight size={14} className="text-slate-400" />
                <span>{order.weight} kg • {order.serviceType}</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-500">
                <Calendar size={14} className="text-slate-400" />
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium">Total Tagihan</p>
                <p className="text-sm font-bold text-slate-800">Rp {order.totalPrice.toLocaleString('id-ID')}</p>
              </div>
              <WaStatusIndicator 
                status={order.waStatus} 
                onRefresh={() => checkWaStatus(order.id)} 
                isEnabled={isWaEnabled} 
              />
            </div>

            <div className="flex space-x-2 pt-1">
              {order.status === OrderStatus.PENDING && (
                <button 
                  onClick={() => updateStatus(order.id, OrderStatus.PROCESSING)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1"
                >
                  <Loader2 size={14} className="animate-spin" />
                  <span>Proses</span>
                </button>
              )}
              {order.status === OrderStatus.PROCESSING && (
                <button 
                  onClick={() => updateStatus(order.id, OrderStatus.COMPLETED)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1"
                >
                  <Check size={14} />
                  <span>Selesai</span>
                </button>
              )}
              {order.status === OrderStatus.COMPLETED && (
                <button 
                  onClick={() => updateStatus(order.id, OrderStatus.PICKED_UP)}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1"
                >
                  <Truck size={14} />
                  <span>Ambil</span>
                </button>
              )}
              <button className="p-2 text-slate-400 border border-slate-100 rounded-xl hover:bg-slate-50">
                <MoreVertical size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4">ID / Tanggal</th>
                <th className="px-6 py-4">Pelanggan</th>
                <th className="px-6 py-4">Layanan</th>
                <th className="px-6 py-4">Berat</th>
                <th className="px-6 py-4">Status WA</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-indigo-600">#{order.id}</p>
                    <p className="text-[10px] text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-800">{order.customerName}</p>
                    <p className="text-[10px] text-slate-500">{order.phoneNumber}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold">
                      {order.serviceType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600">{order.weight} kg</td>
                  <td className="px-6 py-4">
                     <WaStatusIndicator 
                      status={order.waStatus} 
                      onRefresh={() => checkWaStatus(order.id)} 
                      isEnabled={isWaEnabled} 
                     />
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800 text-sm">
                    Rp {order.totalPrice.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-1">
                      {order.status === OrderStatus.PENDING && (
                        <button onClick={() => updateStatus(order.id, OrderStatus.PROCESSING)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Loader2 size={16} /></button>
                      )}
                      {order.status === OrderStatus.PROCESSING && (
                        <button onClick={() => updateStatus(order.id, OrderStatus.COMPLETED)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"><Check size={16} /></button>
                      )}
                      {order.status === OrderStatus.COMPLETED && (
                        <button onClick={() => updateStatus(order.id, OrderStatus.PICKED_UP)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg"><Truck size={16} /></button>
                      )}
                      <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"><MoreVertical size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredOrders.length === 0 && (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
          <Package size={48} strokeWidth={1} className="mb-4 opacity-20" />
          <p className="text-sm font-medium">Tidak ada data ditemukan</p>
        </div>
      )}
    </div>
  );
};

export default OrderList;
