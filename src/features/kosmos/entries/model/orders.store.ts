import { create } from 'zustand';

interface OrdersStore {
  orders: string[];
  onAppendOrderId: (payload: string) => void;
}

export const useOrdersStore = create<OrdersStore>((set, get) => ({
  orders: [],
  onAppendOrderId: (_id: string) => {
    const { orders } = get();
    if (!orders.includes(_id))
      set((state) => ({ orders: [...state.orders, _id] }));
  }
}));
