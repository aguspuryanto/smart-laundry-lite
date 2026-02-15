
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Receipt, 
  Settings as SettingsIcon, 
  LogOut, 
  Plus, 
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Order, OrderStatus, Expense, ServiceType, User } from './types';
import { dbInstance } from './db';
import Dashboard from './components/Dashboard';
import OrderList from './components/OrderList';
import Finance from './components/Finance';
import NewOrderModal from './components/NewOrderModal';
import Login from './components/Login';
import Settings from './components/Settings';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'finance' | 'settings'>('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info' | 'error'} | null>(null);
  const [fonnteToken, setFonnteToken] = useState<string>('');
  const [isLoadingDB, setIsLoadingDB] = useState(true);

  // Initialize DB and Seed Data
  useEffect(() => {
    const initApp = async () => {
      try {
        await dbInstance.init();
        
        // Seed initial admin if not exists
        const admin = await dbInstance.getByKey<any>('users', 'admin');
        if (!admin) {
          await dbInstance.put('users', { username: 'admin', password: 'password123', role: 'admin' });
        }

        // Load data from IndexedDB
        const loadedOrders = await dbInstance.getAll<Order>('orders');
        const loadedExpenses = await dbInstance.getAll<Expense>('transaksi');
        const tokenSetting = await dbInstance.getByKey<{key: string, value: string}>('settings', 'fonnte_token');
        
        setOrders(loadedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        setExpenses(loadedExpenses);
        if (tokenSetting) setFonnteToken(tokenSetting.value);
        
      } catch (err) {
        console.error("Failed to init DB", err);
      } finally {
        setIsLoadingDB(false);
      }
    };
    initApp();
  }, []);

  const handleLogin = (u: User) => setUser(u);
  const handleLogout = () => setUser(null);

  const saveFonnteToken = async (newToken: string) => {
    setFonnteToken(newToken);
    await dbInstance.put('settings', { key: 'fonnte_token', value: newToken });
  };

  const addOrder = async (newOrder: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    const order: Order = {
      ...newOrder,
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      createdAt: new Date().toISOString(),
      status: OrderStatus.PENDING,
    };
    
    await dbInstance.put('orders', order);
    setOrders([order, ...orders]);
    setIsNewOrderOpen(false);
    showNotification(`Pesanan ${order.id} berhasil dibuat!`, 'success');
  };

  const updateOrderStatus = async (id: string, newStatus: OrderStatus) => {
    const updatedOrders = orders.map(o => o.id === id ? { ...o, status: newStatus } : o);
    setOrders(updatedOrders);
    
    const targetOrder = updatedOrders.find(o => o.id === id);
    if (targetOrder) {
      await dbInstance.put('orders', targetOrder);
      if (newStatus === OrderStatus.PROCESSING || newStatus === OrderStatus.COMPLETED) {
        await sendFonnteNotification(targetOrder, newStatus);
      }
    }
  };

  const addExpense = async (newExp: Omit<Expense, 'id' | 'date'>) => {
    const expense: Expense = {
      ...newExp,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString()
    };
    await dbInstance.put('transaksi', expense);
    setExpenses([expense, ...expenses]);
    showNotification("Catatan pengeluaran berhasil disimpan", "success");
  };

  const formatPhoneNumber = (phone: string) => {
    let formatted = phone.replace(/[^0-9]/g, '');
    if (formatted.startsWith('0')) {
      formatted = '62' + formatted.slice(1);
    }
    return formatted;
  };

  const sendFonnteNotification = async (order: Order, status: OrderStatus) => {
    if (!fonnteToken) {
      showNotification("API Token Fonnte belum diatur.", "error");
      return;
    }

    let message = "";
    if (status === OrderStatus.PROCESSING) {
      message = `*Smart Laundry Pro*\n\nHalo ${order.customerName},\n\nPesanan Anda *#${order.id}* sedang *DIPROSES*.\nLayanan: ${order.serviceType}\nTotal: Rp ${order.totalPrice.toLocaleString('id-ID')}\n\nTerima kasih!`;
    } else if (status === OrderStatus.COMPLETED) {
      message = `*Smart Laundry Pro*\n\nHalo ${order.customerName},\n\nKabar baik! Pesanan Anda *#${order.id}* sudah *SELESAI* dan siap diambil.\n\nTotal Bayar: *Rp ${order.totalPrice.toLocaleString('id-ID')}*`;
    }

    try {
      const response = await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: { 'Authorization': fonnteToken },
        body: new URLSearchParams({
          'target': formatPhoneNumber(order.phoneNumber),
          'message': message,
        })
      });
      const data = await response.json();
      if (data.status) showNotification(`WhatsApp terkirim!`, 'success');
    } catch (err) {
      showNotification("Koneksi Fonnte bermasalah.", "error");
    }
  };

  const showNotification = (message: string, type: 'success' | 'info' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  if (isLoadingDB) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50">
        <Loader2 size={48} className="text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Menghubungkan Database...</p>
      </div>
    );
  }

  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <aside className="w-64 bg-indigo-700 text-white flex flex-col shadow-xl z-20">
        <div className="p-6 flex items-center space-x-3">
          <div className="bg-white p-2 rounded-lg text-indigo-700">
            <Package size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight">Smart Laundry</span>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'orders', label: 'Pesanan', icon: Package },
            { id: 'finance', label: 'Keuangan', icon: Receipt },
            { id: 'settings', label: 'Pengaturan', icon: SettingsIcon },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id ? 'bg-white/20 text-white font-semibold' : 'text-indigo-100 hover:bg-white/10'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-indigo-600">
          <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-indigo-800 hover:bg-red-600 transition-colors text-sm font-medium">
            <LogOut size={18} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-auto relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
          <h1 className="text-xl font-bold text-slate-800 uppercase tracking-wide">
            {activeTab === 'dashboard' ? 'Overview' : activeTab === 'orders' ? 'Pesanan' : activeTab === 'finance' ? 'Keuangan' : 'Pengaturan'}
          </h1>
          <div className="flex items-center space-x-4">
            {activeTab !== 'settings' && (
              <button onClick={() => setIsNewOrderOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-md transition-all active:scale-95">
                <Plus size={18} />
                <span>Order Baru</span>
              </button>
            )}
          </div>
        </header>

        <div className="p-8 pb-20">
          {activeTab === 'dashboard' && <Dashboard orders={orders} expenses={expenses} />}
          {activeTab === 'orders' && <OrderList orders={orders} updateStatus={updateOrderStatus} />}
          {activeTab === 'finance' && <Finance orders={orders} expenses={expenses} addExpense={addExpense} />}
          {activeTab === 'settings' && <Settings token={fonnteToken} setToken={saveFonnteToken} />}
        </div>

        {notification && (
          <div className={`fixed bottom-8 right-8 p-4 rounded-2xl shadow-2xl flex items-center space-x-3 transition-all animate-in slide-in-from-right-10 ${
            notification.type === 'success' ? 'bg-green-600 text-white' : 
            notification.type === 'error' ? 'bg-rose-600 text-white' : 'bg-indigo-600 text-white'
          } z-50 max-w-sm`}>
            {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <p className="font-semibold text-sm">{notification.message}</p>
          </div>
        )}

        <NewOrderModal isOpen={isNewOrderOpen} onClose={() => setIsNewOrderOpen(false)} onSubmit={addOrder} />
      </main>
    </div>
  );
};

export default App;
