import { useRef, useState } from 'react';
import { createContextSelector } from '@utils/createContextSelector';
import { INITIAL_SELECTED_TOKENS, INITIAL_SLIPPAGE_TOLERANCE } from './initial';
import { FIELD } from '../types/fields';
import { TokenInfo } from '../types';
import { BottomSheetRef } from '@components/composite';

export const DEXSwapContext = () => {
  const bottomSheetRef = useRef<BottomSheetRef>(null);

  const [selectedTokens, setSelectedTokens] = useState(INITIAL_SELECTED_TOKENS);
  const [slippageTollerance, setSlippageTollerance] = useState(
    INITIAL_SLIPPAGE_TOLERANCE
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
    bottomSheetRef.current?.dismiss();
  };

  const onChangeSlippageTollerance = (value: number) =>
    setSlippageTollerance(value);

  const onChangeSelectedTokensAmount = (
    key: keyof typeof FIELD,
    value: string
  ) => {
    setSelectedTokensAmount({
      ...selectedTokensAmount,
      [key]: value
    });
  };

  return {
    bottomSheetRef,
    selectedTokensAmount,
    selectedTokens,
    slippageTollerance,
    onChangeSelectedTokensAmount,
    onChangeSelectedTokens,
    onChangeSlippageTollerance
  };
};

export const [DEXSwapContextProvider, useDEXSwapContext] =
  createContextSelector(DEXSwapContext);

export const useDEXSwapContextSelector = () => useDEXSwapContext((ctx) => ctx);
