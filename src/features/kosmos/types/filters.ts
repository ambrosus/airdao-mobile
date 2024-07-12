export type StatusFilterValues = 'all' | 'closed' | 'active';

export enum Statuses {
  ALL = 'all',
  CLOSED = 'closed',
  ACTIVE = 'active'
}

export type PaymetsTokens = 'BOND' | 'USDC' | 'AMB';

export interface FiltersState {
  status: StatusFilterValues;
  payment: PaymetsTokens | null;
}
