import { useRef, useState } from 'react';
import { createContextSelector } from '@utils/createContextSelector';
import { INITIAL_SELECTED_TOKENS, INITIAL_SLIPPAGE_TOLERANCE } from './initial';
import { FIELD } from '../types/fields';
import { TokenInfo } from '../types';
import { BottomSheetRef } from '@components/composite';

export const DEXSwapContext = () => {
  const bottomSheetRefOutput = useRef<BottomSheetRef>(null);
  const bottomSheetRefInput = useRef<BottomSheetRef>(null);

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
    bottomSheetRefInput,
    bottomSheetRefOutput,
    selectedTokensAmount,
    setSelectedTokensAmount,
    selectedTokens,
    setSelectedTokens,
    slippageTollerance,
    onChangeSelectedTokensAmount,
    onChangeSelectedTokens,
    onChangeSlippageTollerance,
    onDismissBottomSheets
  };
};

export const [DEXSwapContextProvider, useDEXSwapContext] =
  createContextSelector(DEXSwapContext);

export const useDEXSwapContextSelector = () => useDEXSwapContext((ctx) => ctx);
