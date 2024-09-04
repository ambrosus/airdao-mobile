import { useCallback, useState } from 'react';
import { ethers } from 'ethers';
import { createContextSelector } from '@utils/createContextSelector';
import { Token, TxType } from '@features/kosmos/types';
import { getBalanceOf } from '@features/kosmos/lib/contracts';
import { NumberUtils } from '@utils/number';
import { useWallet } from '@hooks';

const KosmosMarketsContext = () => {
  const { wallet } = useWallet();

  const [tokens, setTokens] = useState<Token[]>([]);
  const [isTokensLoading, setIsTokensLoading] = useState(false);
  const [isMarketTooltipVisible, setIsMarketTooltipVisible] = useState(false);
  const [isExactMarketLoading, setIsExactMarketLoading] = useState(false);
  const [amountToBuy, setAmountToBuy] = useState('');
  const [bnBalance, setBnBalance] = useState<ethers.BigNumber | null>(null);
  const [isBalanceFetching, setIsBalanceFetching] = useState(false);
  const [claimedOrderIds, setClaimedOrderIds] = useState<string[]>([]);

  const [transactions, setTransactions] = useState<TxType[]>([]);

  const onToggleMarketTooltip = useCallback((value: boolean) => {
    setIsMarketTooltipVisible(value);
  }, []);

  const onChangeAmountToBuy = useCallback(
    (amount: string) => setAmountToBuy(amount),
    []
  );

  const onAppendClaimedOrderId = useCallback(
    (id: string) => {
      if (!claimedOrderIds.includes(id))
        setClaimedOrderIds((prevState) => [...prevState, id]);
    },
    [claimedOrderIds]
  );

  const reset = useCallback(() => {
    setIsMarketTooltipVisible(false);
    setAmountToBuy('');
    setBnBalance(null);
  }, []);

  const [bondBalance, setBondBalance] = useState('');
  const fetchBondBalance = async (qouteToken: Token | undefined) => {
    try {
      setIsBalanceFetching(true);
      const bnBalance = await getBalanceOf({
        ownerAddress: wallet?.address ?? '',
        token: qouteToken
      });

      const formattedBalance = NumberUtils.limitDecimalCount(
        ethers.utils.formatEther(bnBalance?._hex),
        2
      );

      if (formattedBalance !== bondBalance) {
        setBondBalance(formattedBalance);
        setBnBalance(bnBalance);
      }
    } finally {
      setIsBalanceFetching(false);
    }
  };

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
    claimedOrderIds,
    onAppendClaimedOrderId,
    reset,
    bondBalance,
    fetchBondBalance
  };
};

export const [KosmosMarketsContextProvider, useKosmosMarketsContext] =
  createContextSelector(KosmosMarketsContext);

export const useKosmosMarketsContextSelector = () =>
  useKosmosMarketsContext((ctx) => ctx);
