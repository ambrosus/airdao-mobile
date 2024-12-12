export type StatusFilterValues = 'all' | 'closed' | 'active';

export type PaymentTokens = 'BOND' | 'USDC' | 'AMB';

export interface FiltersState {
  status: StatusFilterValues;
  payment: PaymentTokens | null;
}
