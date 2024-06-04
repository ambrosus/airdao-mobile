import { useState } from 'react';
import { createContextSelector } from '@utils/createContextSelector';
import { INITIAL_SELECTED_TOKENS, INITIAL_SLIPPAGE_TOLERANCE } from './initial';

export const DEXSwapContext = () => {
  const [slippageTollerance, setSlippageTollerance] = useState(
    INITIAL_SLIPPAGE_TOLERANCE
  );

  const [selectedTokens] = useState(INITIAL_SELECTED_TOKENS);

  const onChangeSlippageTollerance = (value: number) =>
    setSlippageTollerance(value);

  return { selectedTokens, slippageTollerance, onChangeSlippageTollerance };
};

export const [DEXSwapContextProvider, useDEXSwapContext] =
  createContextSelector(DEXSwapContext);

export const useDEXSwapContextSelector = () => useDEXSwapContext((ctx) => ctx);
