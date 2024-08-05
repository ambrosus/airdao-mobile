import { useEffect, useState } from 'react';
import { BigNumber, utils } from 'ethers';
import { useKosmosMarketsContextSelector } from '@features/kosmos/context';
import { MarketType } from '@features/kosmos/types';
import { useMarketDetails } from './use-market-details';

export function useTransactionErrorHandler(market: MarketType) {
  const { protocolFee, willGet, willGetSubFee } = useMarketDetails(market);
  const { amountToBuy, bnBalance } = useKosmosMarketsContextSelector();

  const [error, setError] = useState('');

  useEffect(() => {
    if (amountToBuy === '') return setError('');

    if (willGetSubFee?.gte(BigNumber.from(market.maxPayout))) {
      setError('Enter amount less then max bondable value');
    } else if (bnBalance && utils.parseUnits(amountToBuy).gt(bnBalance)) {
      setError('Insufficient balance');
    } else if (willGet?.gt(BigNumber.from(market.capacity))) {
      setError('Enter amount less then available amount');
    } else {
      setError('');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amountToBuy, market, protocolFee, bnBalance]);

  return { error, protocolFee };
}
