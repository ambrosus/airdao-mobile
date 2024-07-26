import { useCallback, useEffect, useRef, useState } from 'react';
import { createContextSelector } from '@utils/createContextSelector';
import {
  INITAL_SETTINGS,
  INITAL_UI_BOTTOM_SHEET_INFORMATION,
  INITIAL_SELECTED_TOKENS,
  INITIAL_SELECTED_TOKENS_AMOUNT
} from './initials';
import { BottomSheetRef } from '@components/composite';
import {
  FIELD,
  SelectedPairsState,
  SelectedTokensKeys
} from '@/features/swap/types';

export const SwapContext = () => {
  const bottomSheetTokenARef = useRef<BottomSheetRef>(null);
  const bottomSheetTokenBRef = useRef<BottomSheetRef>(null);
  const bottomSheetPreviewSwapRef = useRef<BottomSheetRef>(null);
  const isExactInRef = useRef<boolean>(true);
  const allPairsRef = useRef<SelectedPairsState>([]);

  // Tokens connected states
  const [_refExactGetter, setIsExactIn] = useState(true);
  const [selectedTokens, setSelectedTokens] = useState(INITIAL_SELECTED_TOKENS);

  const [lastChangedInput, setLastChangedInput] = useState<SelectedTokensKeys>(
    FIELD.TOKEN_A
  );
  const [selectedTokensAmount, setSelectedTokensAmount] = useState<
    Record<SelectedTokensKeys, string>
  >(INITIAL_SELECTED_TOKENS_AMOUNT);

  const [_refSettingsGetter, setSettings] = useState(INITAL_SETTINGS);
  const [isProcessingSwap, setIsProcessingSwap] = useState(false);
  const [isIncreasingAllowance, setIsIncreassingAllowance] = useState(false);

  // Swap preview information
  const [_refPairsGetter, setPairs] = useState<SelectedPairsState>([]);
  const [uiBottomSheetInformation, setUiBottomSheetInformation] = useState(
    INITAL_UI_BOTTOM_SHEET_INFORMATION
  );

  const latestSelectedTokens = useRef(selectedTokens);
  const latestSelectedTokensAmount = useRef(selectedTokensAmount);

  // Ref setters

  useEffect(() => {
    latestSelectedTokens.current = selectedTokens;
    latestSelectedTokensAmount.current = selectedTokensAmount;
  }, [selectedTokens, selectedTokensAmount]);

  useEffect(() => {
    isExactInRef.current = _refExactGetter;
  }, [_refExactGetter]);

  useEffect(() => {
    allPairsRef.current = _refPairsGetter;
  }, [_refPairsGetter]);

  const reset = useCallback(() => {
    setSelectedTokens(INITIAL_SELECTED_TOKENS);
    setSelectedTokensAmount(INITIAL_SELECTED_TOKENS_AMOUNT);
    setUiBottomSheetInformation(INITAL_UI_BOTTOM_SHEET_INFORMATION);
    setIsExactIn(true);
  }, []);

  return {
    selectedTokens,
    setSelectedTokens,
    selectedTokensAmount,
    setSelectedTokensAmount,
    lastChangedInput,
    latestSelectedTokens,
    latestSelectedTokensAmount,
    setLastChangedInput,
    bottomSheetTokenARef,
    bottomSheetTokenBRef,
    bottomSheetPreviewSwapRef,
    isExactInRef,
    setUiBottomSheetInformation,
    uiBottomSheetInformation,
    _refSettingsGetter,
    _refExactGetter,
    setSettings,
    setIsExactIn,
    isProcessingSwap,
    setIsProcessingSwap,
    isIncreasingAllowance,
    setIsIncreassingAllowance,
    allPairsRef,
    setPairs,
    reset
  };
};

export const [SwapContextProvider, useSwapContext] =
  createContextSelector(SwapContext);

export const useSwapContextSelector = () => useSwapContext((ctx) => ctx);
