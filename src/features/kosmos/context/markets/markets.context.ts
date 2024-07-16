import { useState } from 'react';
import { createContextSelector } from '@utils/createContextSelector';
import { Token } from '@features/kosmos/types';

const KosmosMarketsContext = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isTokensLoading, setIsTokensLoading] = useState(false);

  return { tokens, setTokens, isTokensLoading, setIsTokensLoading };
};

export const [KosmosMarketsContextProvider, useKosmosMarketsContext] =
  createContextSelector(KosmosMarketsContext);

export const useKosmosMarketsContextSelector = () =>
  useKosmosMarketsContext((ctx) => ctx);
