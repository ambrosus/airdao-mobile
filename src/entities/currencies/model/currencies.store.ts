import { create } from 'zustand';
import { Currency } from '@entities/currencies/types';

interface CurrenciesStore {
  currencies: Currency[];
  onSetCurrencies: (payload: Currency[]) => void;
}

export const useCurrenciesStore = create<CurrenciesStore>((set) => ({
  currencies: [],
  onSetCurrencies: (currencies) => set({ currencies })
}));
