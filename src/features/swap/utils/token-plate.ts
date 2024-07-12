import { SwapToken } from '../types';

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
