
import React, { useState } from 'react';
// Added Loader2 to the imports from lucide-react
import { Lock, User as UserIcon, LogIn, Sparkles, Loader2 } from 'lucide-react';
import { User } from '../types';
import { dbInstance } from '../db';

interface LoginProps {
  onLogin: (u: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userRecord = await dbInstance.getByKey<any>('users', username);
      
      if (userRecord && userRecord.password === password) {
        onLogin({ username: userRecord.username, role: userRecord.role });
      } else {
        setError('Username atau password tidak valid.');
      }
    } catch (err) {
      setError('Terjadi kesalahan sistem database.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-700 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/2 translate-y-1/2 animate-pulse"></div>
      
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 z-10 animate-in zoom-in-95 duration-500">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-indigo-100 text-indigo-600 rounded-3xl mb-6 shadow-inner">
            <Sparkles size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Smart Laundry</h1>
          <p className="text-slate-500 mt-2 font-medium">Sistem Persisten IndexedDB</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl text-sm font-medium">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <UserIcon size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Username" 
                className="w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-95 flex items-center justify-center space-x-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Masuk Sistem'}
          </button>

          <p className="text-center text-slate-400 text-[10px] pt-4 font-bold uppercase tracking-widest">
            Database Terkoneksi (IndexedDB)
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
