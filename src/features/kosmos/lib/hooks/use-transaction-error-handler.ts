import { useEffect, useState } from 'react';
import { BigNumber, utils } from 'ethers';
import { useTranslation } from 'react-i18next';
import { useKosmosMarketsContextSelector } from '@features/kosmos/context';
import { MarketType } from '@features/kosmos/types';
import { useMarketDetails } from './use-market-details';

export function useTransactionErrorHandler(market: MarketType | undefined) {
  const { t } = useTranslation();
  const { protocolFee, willGet, willGetSubFee } = useMarketDetails(market);
  const { amountToBuy, bnBalance } = useKosmosMarketsContextSelector();

  const [error, setError] = useState('');

  useEffect(() => {
    if (amountToBuy === '') return setError('');

    if (willGetSubFee?.gte(BigNumber.from(market?.maxPayout))) {
      setError(t('kosmos.input.error.max.bondable'));
    } else if (bnBalance && utils.parseUnits(amountToBuy).gt(bnBalance)) {
      setError(t('bridge.insufficient.funds'));
    } else if (willGet?.gt(BigNumber.from(market?.capacity))) {
      setError(t('kosmos.input.error.max.value'));
    } else {
      setError('');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amountToBuy, market, protocolFee, bnBalance]);

  return { error, protocolFee };
}
