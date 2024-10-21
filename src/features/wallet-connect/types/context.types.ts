export enum CONNECT_VIEW_STEPS {
  APPROVE = 'APPROVE',
  PENDING = 'PENDING',
  CONNECT_ERROR = 'CONNECT_ERROR',
  PAIR_EXPIRED_ERROR = 'PAIR_EXPIRED_ERROR',
  WRONG_CHAIN_ERROR = 'WRONG_CHAIN_ERROR'
}

export type WalletConnectViewValues = keyof typeof CONNECT_VIEW_STEPS;
