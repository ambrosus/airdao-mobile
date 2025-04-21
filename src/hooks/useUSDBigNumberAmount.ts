import { useMemo } from 'react';
import { BigNumber } from 'ethers';
import { formatEther, parseUnits } from 'ethers/lib/utils';
import { lowerCase } from 'lodash';
import { CryptoCurrencyCode } from '@appTypes';
import { useCurrenciesStore } from '@entities/currencies/model';

export const useUSDBigNumberAmount = (
  weiAmount: number | string,
  symbol: CryptoCurrencyCode | string = CryptoCurrencyCode.ASC
) => {
  const { currencies } = useCurrenciesStore();

  return useMemo(() => {
    const token = currencies.find((token) =>
      lowerCase(token.symbol).includes(lowerCase(symbol))
    );

    if (!weiAmount || !token?.bestUSDPrice) return '0.00';

    const priceString = token.bestUSDPrice.toString();
    const [integerPart, fractionalPart = ''] = priceString.split('.');
    const tokenPrice = [integerPart, fractionalPart.slice(0, 18)].join('.');

    const priceInWei = parseUnits(tokenPrice, 18);
    const weiBigNumber = BigNumber.from(weiAmount);

    const usdPrice = priceInWei
      .mul(weiBigNumber)
      .div(BigNumber.from(10).pow(18));

    const usdPriceInEther = parseFloat(formatEther(usdPrice));
    if (usdPriceInEther < 0.01) {
      return '0.00';
    }

    return formatEther(usdPrice);
  }, [weiAmount, currencies, symbol]);
};
