
import { Order, Expense, User } from './types';

const DB_NAME = 'SmartLaundryDB';
const DB_VERSION = 1;

export class LaundryDB {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'username' });
        }
        if (!db.objectStoreNames.contains('orders')) {
          db.createObjectStore('orders', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('transaksi')) {
          db.createObjectStore('transaksi', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };

      request.onsuccess = (event: any) => {
        this.db = event.target.result;
        resolve();
      };

      request.onerror = (event: any) => reject(event.target.error);
    });
  }

  private getStore(name: string, mode: IDBTransactionMode) {
    if (!this.db) throw new Error('Database not initialized');
    const transaction = this.db.transaction(name, mode);
    return transaction.objectStore(name);
  }

  // Generic helpers
  async getAll<T>(storeName: string): Promise<T[]> {
    return new Promise((resolve) => {
      const store = this.getStore(storeName, 'readonly');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
    });
  }

  async put(storeName: string, data: any): Promise<void> {
    return new Promise((resolve) => {
      const store = this.getStore(storeName, 'readwrite');
      const request = store.put(data);
      request.onsuccess = () => resolve();
    });
  }

  async getByKey<T>(storeName: string, key: string): Promise<T | null> {
    return new Promise((resolve) => {
      const store = this.getStore(storeName, 'readonly');
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  async delete(storeName: string, key: string): Promise<void> {
    const store = this.getStore(storeName, 'readwrite');
    store.delete(key);
  }
}

export const dbInstance = new LaundryDB();
