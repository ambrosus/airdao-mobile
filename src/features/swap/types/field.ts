import { SwapToken } from './token';

export enum FIELD {
  TOKEN_A = 'TOKEN_A',
  TOKEN_B = 'TOKEN_B'
}

export type SelectedTokensKeys = keyof typeof FIELD;
export type SelectedTokensState = Record<SelectedTokensKeys, SwapToken | null>;
export type SelectedTokensAmountState = Record<SelectedTokensKeys, string>;
