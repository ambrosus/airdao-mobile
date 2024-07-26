import { useCallback, useState } from 'react';
import { createContextSelector } from '@utils/createContextSelector';
import { Token, TxType } from '@features/kosmos/types';
import { ethers } from 'ethers';

const KosmosMarketsContext = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isTokensLoading, setIsTokensLoading] = useState(false);
  const [isMarketTooltipVisible, setIsMarketTooltipVisible] = useState(false);
  const [isExactMarketLoading, setIsExactMarketLoading] = useState(false);
  const [amountToBuy, setAmountToBuy] = useState('');
  const [bnBalance, setBnBalance] = useState<ethers.BigNumber | null>(null);
  const [isBalanceFetching, setIsBalanceFetching] = useState(false);
  const [transactions, setTransactions] = useState<TxType[]>([]);

  const onToggleMarketTooltip = useCallback((value: boolean) => {
    setIsMarketTooltipVisible(value);
  }, []);

  const onChangeAmountToBuy = useCallback(
    (amount: string) => setAmountToBuy(amount),
    []
  );

  const reset = useCallback(() => {
    setIsMarketTooltipVisible(false);
    setAmountToBuy('');
    setBnBalance(null);
  }, []);

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
    amountToBuy,
    bnBalance,
    setBnBalance,
    isBalanceFetching,
    setIsBalanceFetching,
    transactions,
    setTransactions,
    reset
  };
};

export const [KosmosMarketsContextProvider, useKosmosMarketsContext] =
  createContextSelector(KosmosMarketsContext);

export const useKosmosMarketsContextSelector = () =>
  useKosmosMarketsContext((ctx) => ctx);
