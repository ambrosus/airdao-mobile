import { useCallback, useState } from 'react';
import { createContextSelector } from '@utils/createContextSelector';
import { Token } from '@features/kosmos/types';

const KosmosMarketsContext = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isTokensLoading, setIsTokensLoading] = useState(false);
  const [isMarketTooltipVisible, setIsMarketTooltipVisible] = useState(false);
  const [isExactMarketLoading, setIsExactMarketLoading] = useState(false);
  const [amountToBuy, setAmountToBuy] = useState('');

  const onToggleMarketTooltip = useCallback((value: boolean) => {
    setIsMarketTooltipVisible(value);
  }, []);

  const onChangeAmountToBuy = useCallback(
    (amount: string) => setAmountToBuy(amount),
    []
  );

  return {
    tokens,
    setTokens,
    isTokensLoading,
    setIsTokensLoading,
    isMarketTooltipVisible,
    onToggleMarketTooltip,
    isExactMarketLoading,
    setIsExactMarketLoading,
    onChangeAmountToBuy,
    amountToBuy
  };
};

export const [KosmosMarketsContextProvider, useKosmosMarketsContext] =
  createContextSelector(KosmosMarketsContext);

export const useKosmosMarketsContextSelector = () =>
  useKosmosMarketsContext((ctx) => ctx);
