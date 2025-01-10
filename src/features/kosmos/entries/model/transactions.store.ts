import { create } from 'zustand';
import { TxType } from '../types';

interface TransactionsStore {
  transactions: TxType[];
  onChangeTransactions: (payload: TxType[]) => void;
}

export const useTransactionsStore = create<TransactionsStore>((set) => ({
  transactions: [],
  onChangeTransactions: (transactions) => set({ transactions })
}));
