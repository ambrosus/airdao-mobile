import { useState } from 'react';
import { createContextSelector } from '@utils/createContextSelector';
import { FieldSelectedTokens } from './types';

export const DEXSwapContext = () => {
  const [selectedTokens] = useState<FieldSelectedTokens>({
    INPUT: null,
    OUTPUT: null
  });

  return { selectedTokens };
};

export const [DEXSwapContextProvider, useDEXSwapContext] =
  createContextSelector(DEXSwapContext);

export const useDEXSwapContextSelector = () => useDEXSwapContext((ctx) => ctx);
