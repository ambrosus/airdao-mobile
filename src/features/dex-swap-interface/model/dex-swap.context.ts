import { useCallback, useEffect, useRef, useState } from 'react';
import { createContextSelector } from '@utils/createContextSelector';
import { INITIAL_SELECTED_TOKENS, INITIAL_SLIPPAGE_TOLERANCE } from './initial';
import { FIELD } from '../types/fields';
import { TokenInfo } from '../types';
import { BottomSheetRef } from '@components/composite';
import { useDEXCryptoCurrency } from '../lib/hooks/use-dex-crypto-currency';

export const DEXSwapContext = () => {
  const bottomSheetRefOutput = useRef<BottomSheetRef>(null);
  const bottomSheetRefInput = useRef<BottomSheetRef>(null);

  const [lastChangedInput, setLastChangedInput] = useState<
    keyof typeof FIELD | null
  >(null);

  const [selectedTokens, setSelectedTokens] = useState(INITIAL_SELECTED_TOKENS);
  const [slippageTollerance, setSlippageTollerance] = useState(
    INITIAL_SLIPPAGE_TOLERANCE
  );

  const { calculateUSDPrice } = useDEXCryptoCurrency(
    selectedTokens.OUTPUT?.symbol
  );

  const [selectedTokensAmount, setSelectedTokensAmount] = useState<
    Record<keyof typeof FIELD, string>
  >({
    INPUT: '',
    OUTPUT: ''
  });

  const onChangeSelectedTokens = (key: string, token: TokenInfo) => {
    setSelectedTokensAmount({
      ...selectedTokensAmount,
      [key]: ''
    });

    setSelectedTokens({
      ...selectedTokens,
      [key]: token
    });
    bottomSheetRefInput.current?.dismiss();
    bottomSheetRefOutput.current?.dismiss();
  };

  const onDismissBottomSheets = (type: keyof typeof FIELD) => {
    const isBottomSheetVisible =
      type === FIELD.INPUT
        ? bottomSheetRefInput.current?.isVisible
        : bottomSheetRefOutput.current?.isVisible;

    const bottomSheetRef =
      type === FIELD.INPUT
        ? bottomSheetRefInput.current
        : bottomSheetRefOutput.current;

    bottomSheetRef?.[isBottomSheetVisible ? 'dismiss' : 'show']();
  };

  const onChangeSlippageTollerance = (value: number) =>
    setSlippageTollerance(value);

  const onApplyOppositeCurrencyAmount = useCallback(
    (key: keyof typeof FIELD, value: number | string) => {
      setSelectedTokensAmount((prevSelectedTokensAmount) => ({
        ...prevSelectedTokensAmount,
        [key]: String(value)
      }));
    },
    []
  );

  const onChangeSelectedTokensAmount = useCallback(
    (key: keyof typeof FIELD, value: string) => {
      setLastChangedInput(key);
      const oppositeKey = key === FIELD.INPUT ? FIELD.OUTPUT : FIELD.INPUT;
      const isEmpty = value === '' || value === '0';

      setSelectedTokensAmount((prevSelectedTokensAmount) => ({
        ...prevSelectedTokensAmount,
        [key]: value
      }));

      if (selectedTokens[oppositeKey]) {
        onApplyOppositeCurrencyAmount(
          oppositeKey,
          isEmpty ? '' : calculateUSDPrice(selectedTokensAmount[key])
        );
      }
    },
    [
      calculateUSDPrice,
      onApplyOppositeCurrencyAmount,
      selectedTokens,
      selectedTokensAmount
    ]
  );

  useEffect(() => {
    if (!lastChangedInput) return;

    const oppositeKey =
      lastChangedInput === FIELD.INPUT ? FIELD.OUTPUT : FIELD.INPUT;
    const oppositeValue = selectedTokensAmount[oppositeKey];

    if (oppositeValue === '' && selectedTokens[oppositeKey]) {
      const valueToApply =
        selectedTokensAmount[lastChangedInput] === ''
          ? ''
          : calculateUSDPrice(selectedTokensAmount[lastChangedInput]);
      onApplyOppositeCurrencyAmount(oppositeKey, valueToApply);
      setLastChangedInput(null);
    }
  }, [
    selectedTokens,
    selectedTokensAmount,
    lastChangedInput,
    onApplyOppositeCurrencyAmount,
    calculateUSDPrice
  ]);

  return {
    bottomSheetRefInput,
    bottomSheetRefOutput,
    onDismissBottomSheets,
    selectedTokensAmount,
    setSelectedTokensAmount,
    selectedTokens,
    setSelectedTokens,
    onChangeSelectedTokens,
    slippageTollerance,
    onChangeSlippageTollerance,
    onChangeSelectedTokensAmount,
    onApplyOppositeCurrencyAmount,
    setLastChangedInput
  };
};

export const [DEXSwapContextProvider, useDEXSwapContext] =
  createContextSelector(DEXSwapContext);

export const useDEXSwapContextSelector = () => useDEXSwapContext((ctx) => ctx);
