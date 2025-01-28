import { SendFundsState } from '../model';

interface ChangeArgs {
  payload: Partial<SendFundsState>;
  state: SendFundsState;
}

export function $change({ payload, state }: ChangeArgs) {
  return {
    ...state,
    state: { ...state, ...payload }
  };
}
