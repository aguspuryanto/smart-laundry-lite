
export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  PICKED_UP = 'PICKED_UP'
}

export enum ServiceType {
  WASH_FOLD = 'Cuci Lipat',
  WASH_IRON = 'Cuci Setrika',
  IRON_ONLY = 'Setrika Saja',
  DRY_CLEAN = 'Dry Clean'
}

export interface Order {
  id: string;
  customerName: string;
  phoneNumber: string;
  weight: number; // in kg
  serviceType: ServiceType;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  estimatedCompletion: string;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
}

export interface User {
  username: string;
  role: 'admin' | 'staff';
}

export interface FinancialReport {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
}
