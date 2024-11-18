import { create } from 'zustand';
import { SendFundsState } from './types';
import { SEND_FUNDS_INITIAL_STATE, $change } from '../utils';

interface SendFundsStore {
  state: SendFundsState;
  onChangeState: (payload: Partial<SendFundsState>) => void;
  onResetState: () => void;
  onChangeWithResetState: (payload: Partial<SendFundsState>) => void;
}

export const useSendFundsStore = create<SendFundsStore>((set, get) => ({
  state: SEND_FUNDS_INITIAL_STATE,
  onChangeState: (payload: Partial<SendFundsState>) => {
    const { state } = get();
    set($change({ payload, state }));
  },
  onResetState: () => set({ state: SEND_FUNDS_INITIAL_STATE }),
  onChangeWithResetState: (payload: Partial<SendFundsState>) => {
    const { state, onResetState } = get();

    onResetState();
    set($change({ payload, state }));
  }
}));
