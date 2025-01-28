import { SwapToken } from '../types';

export function plateVisibility(
  TOKEN_A: SwapToken | null,
  AMOUNT_A: string,
  TOKEN_B: SwapToken | null,
  AMOUNT_B: string
) {
  return TOKEN_A && AMOUNT_A !== '' && TOKEN_B && AMOUNT_B !== '';
}
