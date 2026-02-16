
import React, { useState, useEffect } from 'react';
import { X, Calculator, Calendar } from 'lucide-react';
import { ServiceType, Order, OrderStatus } from '../types';
import { SERVICE_PRICES, ESTIMATED_HOURS } from '../constants';
import { dbInstance } from '../db';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => void;
}

const NewOrderModal: React.FC<NewOrderModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    weight: 0,
    serviceType: ServiceType.WASH_FOLD
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [estimation, setEstimation] = useState('');

  useEffect(() => {
    // Initialize database on component mount
    dbInstance.init().catch(console.error);
  }, []);

  useEffect(() => {
    const price = SERVICE_PRICES[formData.serviceType] * formData.weight;
    setTotalPrice(price);

    const hours = ESTIMATED_HOURS[formData.serviceType];
    const estDate = new Date();
    estDate.setHours(estDate.getHours() + hours);
    setEstimation(estDate.toISOString());
  }, [formData.weight, formData.serviceType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.weight > 0 && formData.customerName) {
      const orderData = {
        ...formData,
        totalPrice,
        estimatedCompletion: estimation
      };
      
      onSubmit(orderData);

      // save into indexDB, table orders
      try {
        const order: Order = {
          id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          customerName: formData.customerName,
          phoneNumber: formData.phoneNumber,
          weight: formData.weight,
          serviceType: formData.serviceType,
          totalPrice: totalPrice,
          status: OrderStatus.PENDING,
          createdAt: new Date().toISOString(),
          estimatedCompletion: estimation
        };
        
        await dbInstance.put('orders', order);
        console.log('Order saved to IndexedDB:', order);
      } catch (error) {
        console.error('Error saving order to IndexedDB:', error);
      }
      
      setFormData({ customerName: '', phoneNumber: '', weight: 0, serviceType: ServiceType.WASH_FOLD });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Buat Pesanan Baru</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Pelanggan</label>
              <input 
                type="text" 
                placeholder="Contoh: Pak Slamet" 
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                value={formData.customerName}
                onChange={e => setFormData({...formData, customerName: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nomor WhatsApp</label>
              <input 
                type="tel" 
                placeholder="Contoh: 08123456789" 
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                value={formData.phoneNumber}
                onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Berat (Kg)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.1"
                    placeholder="0.0" 
                    className="w-full pl-4 pr-10 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                    value={formData.weight || ''}
                    onChange={e => setFormData({...formData, weight: Number(e.target.value)})}
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold uppercase tracking-tight">Kg</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Layanan</label>
                <select 
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm bg-white appearance-none"
                  value={formData.serviceType}
                  onChange={e => setFormData({...formData, serviceType: e.target.value as ServiceType})}
                >
                  {Object.values(ServiceType).map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
             <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2 text-slate-500 text-xs font-medium">
                  <Calculator size={14} />
                  <span>Subtotal Biaya</span>
                </div>
                <span className="text-lg font-bold text-slate-800">Rp {totalPrice.toLocaleString('id-ID')}</span>
             </div>
             <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2 text-slate-500 text-xs font-medium">
                  <Calendar size={14} />
                  <span>Estimasi Selesai</span>
                </div>
                <span className="text-sm font-semibold text-indigo-600">
                  {new Date(estimation).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </span>
             </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-95 flex items-center justify-center space-x-2"
          >
            <span>Simpan & Kirim Notifikasi</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewOrderModal;
