import { useCallback, useState } from 'react';
import { NumberUtils, StringUtils } from '@utils';

export function useAmountChangeHandler() {
  const [amountInCrypto, setAmountInCrypto] = useState('');

  const onChangeAmountHandle = useCallback((newValue: string) => {
    if (!newValue) {
      return setAmountInCrypto('');
    }

    let finalValue = StringUtils.formatNumberInput(newValue);
    finalValue = NumberUtils.limitDecimalCount(finalValue, 3);

    setAmountInCrypto(finalValue);
  }, []);

  return {
    amountInCrypto,
    setAmountInCrypto,
    onChangeAmountHandle
  };
}
