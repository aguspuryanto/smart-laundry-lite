
import React from 'react';
import { Key, Shield, Info, CheckCircle } from 'lucide-react';

interface SettingsProps {
  token: string;
  setToken: (token: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ token, setToken }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
            <Key size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Integrasi WhatsApp</h2>
            <p className="text-sm text-slate-500 font-medium">Hubungkan gateway Fonnte untuk notifikasi otomatis</p>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start space-x-3">
            <Info size={20} className="text-blue-500 mt-0.5 shrink-0" />
            <div className="text-sm text-blue-700 leading-relaxed">
              Dapatkan API Token Anda dari dashboard <a href="https://fonnte.com" target="_blank" className="font-bold underline">Fonnte</a>. Pastikan device Anda sudah terhubung (Connected) agar pesan dapat terkirim.
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Fonnte API Token</label>
            <div className="relative">
              <input
                type="password"
                placeholder="Masukkan API Token Anda..."
                className="w-full pl-4 pr-12 py-3.5 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono text-sm"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
              {token && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">
                  <CheckCircle size={20} />
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-slate-400">
              <Shield size={16} />
              <span className="text-xs font-medium">Token disimpan secara lokal di browser Anda</span>
            </div>
            <button 
              onClick={() => alert('Pengaturan berhasil disimpan!')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg shadow-indigo-100"
            >
              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
        <h3 className="font-bold text-slate-800 mb-4">Informasi Tambahan</h3>
        <ul className="space-y-3">
          {[
            'Otomatis mengubah format nomor 08 menjadi 62.',
            'Notifikasi dikirim saat status berubah ke "PROCESSING" atau "COMPLETED".',
            'Pastikan kuota Fonnte Anda masih mencukupi.'
          ].map((text, i) => (
            <li key={i} className="flex items-center space-x-3 text-sm text-slate-600 font-medium">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Settings;
