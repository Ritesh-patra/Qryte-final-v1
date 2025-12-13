/**
 * OrderContext
 * ============
 * Manages cart/invoice state and recent activity feed across the application.
 * Persists to localStorage for demo purposes.
 * 
 * TODO: Replace with Redux, Zustand, or server-side session management
 */

import React, { createContext, useState, useCallback, useEffect } from 'react';
import type { OrderItem, ActivityEvent, MenuItem, TodaysHighlight } from '../services/api';
import { api } from '../services/api';

export interface InvoiceData {
  id: string;
  items: OrderItem[];
  subtotal: number;
  gstAmount: number;
  total: number;
  appliedCoupon?: string;
  discountAmount: number;
}

export interface OrderContextType {
  // Cart/Invoice
  invoice: InvoiceData | null;
  addItem: (item: MenuItem, qty?: number) => void;
  removeItem: (itemId: number) => void;
  updateItemNote: (itemId: number, note: string) => void;
  updateItemQty: (itemId: number, qty: number) => void;
  applyCoupon: (code: string) => void;
  generateInvoice: () => void;
  clearInvoice: () => void;

  // Recent Activity
  activities: ActivityEvent[];
  addActivity: (message: string, type: ActivityEvent['type']) => void;

  // Today's Highlights & Deals
  todaysHighlight: TodaysHighlight | null;
  setHighlight: (highlightedItemId: number, topDealItemId: number) => Promise<void>;

  // Table & Inventory Integration
  occupyTable: (tableNumber: number) => Promise<void>;
  deductInventory: (menuItemId: number, quantity: number) => Promise<void>;
}

const defaultValue: OrderContextType = {
  invoice: null,
  addItem: () => {},
  removeItem: () => {},
  updateItemNote: () => {},
  updateItemQty: () => {},
  applyCoupon: () => {},
  generateInvoice: () => {},
  clearInvoice: () => {},
  activities: [],
  addActivity: () => {},
  todaysHighlight: null,
  setHighlight: async () => {},
  occupyTable: async () => {},
  deductInventory: async () => {},
};

export const OrderContext = createContext<OrderContextType>(defaultValue);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [invoice, setInvoice] = useState<InvoiceData | null>(() => {
    const saved = localStorage.getItem('qryte_invoice');
    return saved ? JSON.parse(saved) : null;
  });

  const [activities, setActivities] = useState<ActivityEvent[]>(() => {
    const saved = localStorage.getItem('qryte_activities');
    return saved ? JSON.parse(saved) : [];
  });

  const [todaysHighlight, setTodaysHighlight] = useState<TodaysHighlight | null>(null);

  // Load highlights on mount
  useEffect(() => {
    api.getTodaysHighlight().then(highlight => {
      if (highlight) setTodaysHighlight(highlight);
    });
  }, []);

  // Persist invoice to localStorage
  useEffect(() => {
    if (invoice) {
      localStorage.setItem('qryte_invoice', JSON.stringify(invoice));
    } else {
      localStorage.removeItem('qryte_invoice');
    }
  }, [invoice]);

  // Persist activities to localStorage
  useEffect(() => {
    localStorage.setItem('qryte_activities', JSON.stringify(activities));
  }, [activities]);

  const calculateTotals = (items: OrderItem[], discountAmount: number = 0) => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const gstAmount = (subtotal - discountAmount) * 0.12;
    const total = subtotal - discountAmount + gstAmount;
    return { subtotal, gstAmount, total };
  };

  const addItem = useCallback((menuItem: MenuItem, qty: number = 1) => {
    // Convert MenuItem to OrderItem
    const item: OrderItem = {
      id: menuItem.id,
      name: menuItem.name,
      qty,
      price: menuItem.price,
      noteForChef: '',
    };

    setInvoice(prev => {
      if (!prev) {
        const { subtotal, gstAmount, total } = calculateTotals([item]);
        return {
          id: `INV-${Date.now()}`,
          items: [item],
          subtotal,
          gstAmount,
          total,
          discountAmount: 0,
        };
      }

      const existingIndex = prev.items.findIndex(i => i.id === item.id);
      let newItems: OrderItem[];

      if (existingIndex !== -1) {
        newItems = prev.items.map((i, idx) =>
          idx === existingIndex ? { ...i, qty: i.qty + item.qty } : i
        );
      } else {
        newItems = [...prev.items, item];
      }

      const { subtotal, gstAmount, total } = calculateTotals(newItems, prev.discountAmount);
      return { ...prev, items: newItems, subtotal, gstAmount, total };
    });
  }, []);

  const removeItem = useCallback((itemId: number) => {
    setInvoice(prev => {
      if (!prev) return null;
      const newItems = prev.items.filter(i => i.id !== itemId);
      if (newItems.length === 0) return null;

      const { subtotal, gstAmount, total } = calculateTotals(newItems, prev.discountAmount);
      return { ...prev, items: newItems, subtotal, gstAmount, total };
    });
  }, []);

  const updateItemQty = useCallback((itemId: number, qty: number) => {
    if (qty <= 0) {
      removeItem(itemId);
      return;
    }

    setInvoice(prev => {
      if (!prev) return null;
      const newItems = prev.items.map(i =>
        i.id === itemId ? { ...i, qty } : i
      );

      const { subtotal, gstAmount, total } = calculateTotals(newItems, prev.discountAmount);
      return { ...prev, items: newItems, subtotal, gstAmount, total };
    });
  }, [removeItem]);

  const updateItemNote = useCallback((itemId: number, note: string) => {
    setInvoice(prev => {
      if (!prev) return null;
      const newItems = prev.items.map(i =>
        i.id === itemId ? { ...i, noteForChef: note } : i
      );
      return { ...prev, items: newItems };
    });
  }, []);

  const applyCoupon = useCallback((code: string) => {
    setInvoice(prev => {
      if (!prev) return null;

      let discountAmount = 0;
      if (code === 'WELCOME10') {
        discountAmount = prev.subtotal * 0.1;
      } else if (code === 'SAVE15') {
        discountAmount = prev.subtotal * 0.15;
      }

      const { subtotal, gstAmount, total } = calculateTotals(prev.items, discountAmount);
      return {
        ...prev,
        appliedCoupon: discountAmount > 0 ? code : undefined,
        discountAmount,
        subtotal,
        gstAmount,
        total,
      };
    });
  }, []);

  const generateInvoice = useCallback(() => {
    if (invoice && invoice.items.length > 0) {
      addActivity(
        `Generated invoice #${invoice.id.split('-')[1]} for ₹${invoice.total}`,
        'bill'
      );
    }
  }, [invoice]);

  const clearInvoice = useCallback(() => {
    setInvoice(null);
  }, []);

  const addActivity = useCallback((message: string, type: ActivityEvent['type']) => {
    const event: ActivityEvent = {
      id: `EVT-${Date.now()}`,
      message,
      timestamp: new Date(),
      type,
    };
    setActivities(prev => [event, ...prev].slice(0, 50)); // Keep last 50
  }, []);

  const setHighlight = useCallback(async (highlightedItemId: number, topDealItemId: number) => {
    await api.setTodaysHighlight(highlightedItemId, topDealItemId);
    const highlight = await api.getTodaysHighlight();
    if (highlight) setTodaysHighlight(highlight);
    addActivity(`Updated today's highlight and top deal`, 'system');
  }, []);

  const occupyTable = useCallback(async (tableNumber: number) => {
    // Update table status to occupied
    await api.updateTableStatus(tableNumber, 'occupied');
    addActivity(`Table ${tableNumber} marked as occupied`, 'bill');
  }, []);

  const deductInventory = useCallback(async (menuItemId: number, quantity: number) => {
    const result = await api.deductInventory(menuItemId, quantity);
    if (result.success) {
      addActivity(`Inventory deducted for item ${menuItemId}`, 'order');
    }
  }, []);

  const value: OrderContextType = {
    invoice,
    addItem,
    removeItem,
    updateItemNote,
    updateItemQty,
    applyCoupon,
    generateInvoice,
    clearInvoice,
    activities,
    addActivity,
    todaysHighlight,
    setHighlight,
    occupyTable,
    deductInventory,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = (): OrderContextType => {
  const context = React.useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within OrderProvider');
  }
  return context;
};
