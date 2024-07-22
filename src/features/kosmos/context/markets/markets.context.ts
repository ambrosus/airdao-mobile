import { useCallback, useState } from 'react';
import { createContextSelector } from '@utils/createContextSelector';
import { Token } from '@features/kosmos/types';

const KosmosMarketsContext = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isTokensLoading, setIsTokensLoading] = useState(false);
  const [isMarketTooltipVisible, setIsMarketTooltipVisible] = useState(false);

  const onToggleMarketTooltip = useCallback((value: boolean) => {
    setIsMarketTooltipVisible(value);
  }, []);

  return {
    tokens,
    setTokens,
    isTokensLoading,
    setIsTokensLoading,
    isMarketTooltipVisible,
    onToggleMarketTooltip
  };
};

export const [KosmosMarketsContextProvider, useKosmosMarketsContext] =
  createContextSelector(KosmosMarketsContext);

export const useKosmosMarketsContextSelector = () =>
  useKosmosMarketsContext((ctx) => ctx);
