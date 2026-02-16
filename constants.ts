
import { ServiceType } from './types';
import { LayoutDashboard, Package, Receipt, Settings as SettingsIcon } from 'lucide-react';

export const SERVICE_PRICES: Record<ServiceType, number> = {
  [ServiceType.WASH_FOLD]: 7000,
  [ServiceType.WASH_IRON]: 10000,
  [ServiceType.IRON_ONLY]: 6000,
  [ServiceType.DRY_CLEAN]: 25000,
};

export const ESTIMATED_HOURS: Record<ServiceType, number> = {
  [ServiceType.WASH_FOLD]: 24,
  [ServiceType.WASH_IRON]: 48,
  [ServiceType.IRON_ONLY]: 24,
  [ServiceType.DRY_CLEAN]: 72,
};

export const MENU_APP = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'orders', label: 'Pesanan', icon: Package },
  { id: 'finance', label: 'Keuangan', icon: Receipt },
  { id: 'settings', label: 'Pengaturan', icon: SettingsIcon },
];

export const DUMMY_USER = {
  username: 'admin',
  password: 'password123',
};
