import { SwapToken } from '../types';

export function resolvePlateSymbol(
  reversed: boolean,
  isExactIn: boolean,
  symbolA: string,
  symbolB: string
) {
  const reversedPath = reversed ? symbolA : symbolB;

  return {
    TOKEN_A: reversed ? reversedPath : isExactIn ? symbolA : symbolB,
    TOKEN_B: reversed ? reversedPath : !isExactIn ? symbolA : symbolB
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
