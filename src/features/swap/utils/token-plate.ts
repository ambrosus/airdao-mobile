import { SwapToken } from '../types';

export function resolvePlateSymbol(symbolA: string, symbolB: string) {
  return {
    TOKEN_A: symbolA,
    TOKEN_B: symbolB
  };
}

export function plateVisibility(
  TOKEN_A: SwapToken | null,
  AMOUNT_A: string,
  TOKEN_B: SwapToken | null,
  AMOUNT_B: string,
  oppositeAmountPerOneToken: string,
  TokenUSDPrice: number
) {
  return (
    TOKEN_A &&
    AMOUNT_A !== '' &&
    TOKEN_B &&
    AMOUNT_B !== '' &&
    oppositeAmountPerOneToken !== '' &&
    TokenUSDPrice !== 0
  );
}
