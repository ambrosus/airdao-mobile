import { useCallback, useRef, useState } from 'react';
import { createContextSelector } from '@utils/createContextSelector';
import { BottomSheetRef } from '@components/composite';
import {
  INITIAL_SELECTED_TOKENS,
  INITIAL_SLIPPAGE_TOLERANCE,
  INITIAL_TOKENS_AMOUNT
} from './initial';
import { TokenInfo, FIELD } from '../types';

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

  const [selectedTokensAmount, setSelectedTokensAmount] = useState<
    Record<keyof typeof FIELD, string>
  >(INITIAL_TOKENS_AMOUNT);

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

  const reset = useCallback(() => {
    setSlippageTollerance(INITIAL_SLIPPAGE_TOLERANCE);
    setSelectedTokens(INITIAL_SELECTED_TOKENS);
    setSelectedTokensAmount(INITIAL_TOKENS_AMOUNT);
  }, []);

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
    lastChangedInput,
    setLastChangedInput,
    reset
  };
};

export const [DEXSwapContextProvider, useDEXSwapContext] =
  createContextSelector(DEXSwapContext);

export const useDEXSwapContextSelector = () => useDEXSwapContext((ctx) => ctx);
