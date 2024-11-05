import { CurrencyUtils } from '@utils/currency';
import { NumberUtils } from '@utils/number';
import { StringUtils } from '@utils/string';
import { useCallback, useState } from 'react';

interface AmountChangeHandlerHook {
  showUsdAmountOnlyPositiveRate: boolean;
  currencyRate: number;
}

export function useAmountChangeHandler({
  showUsdAmountOnlyPositiveRate,
  currencyRate
}: AmountChangeHandlerHook) {
  const [amountInCrypto, setAmountInCrypto] = useState('');
  const [amountInUSD, setAmountInUSD] = useState('');

  const onChangeAmountHandle = useCallback(
    (newValue: string) => {
      if (!newValue) {
        setAmountInCrypto('');
        setAmountInUSD('');
        return;
      }
      let finalValue = StringUtils.formatNumberInput(newValue);
      finalValue = NumberUtils.limitDecimalCount(finalValue, 3);
      if (showUsdAmountOnlyPositiveRate) {
        setAmountInUSD(finalValue);
        const newUsdAmount = parseFloat(finalValue) || 0;
        setAmountInCrypto(
          CurrencyUtils.toCrypto(newUsdAmount, currencyRate).toFixed(3)
        );
      } else {
        setAmountInCrypto(finalValue);
        const newCryptoAmount = parseFloat(finalValue) || 0;
        setAmountInUSD(
          CurrencyUtils.toUSD(newCryptoAmount, currencyRate).toFixed(3)
        );
      }
    },
    [currencyRate, showUsdAmountOnlyPositiveRate]
  );

  return {
    amountInCrypto,
    amountInUSD,
    setAmountInCrypto,
    setAmountInUSD,
    onChangeAmountHandle
  };
}
