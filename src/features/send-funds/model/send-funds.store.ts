import { create } from 'zustand';
import { Token } from '@models';
import { SendFundsState } from './types';
import { SEND_FUNDS_INITIAL_STATE, $change } from '../utils';

interface SendFundsStore {
  state: SendFundsState;
  tokens: Token[];
  onChangeState: (payload: Partial<SendFundsState>) => void;
  onResetState: () => void;
  onChangeWithResetState: (payload: Partial<SendFundsState>) => void;
  onSetTokens: (payload: Token[]) => void;
}

export const useSendFundsStore = create<SendFundsStore>((set, get) => ({
  state: SEND_FUNDS_INITIAL_STATE,
  tokens: [],
  onChangeState: (payload: Partial<SendFundsState>) => {
    const { state } = get();
    set($change({ payload, state }));
  },
  onResetState: () => set({ state: SEND_FUNDS_INITIAL_STATE }),
  onChangeWithResetState: (payload: Partial<SendFundsState>) => {
    const { state, onResetState } = get();
    onResetState();
    set($change({ payload, state }));
  },
  onSetTokens: (tokens: Token[]) => set({ tokens })
}));
