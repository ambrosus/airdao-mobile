import { useCallback, useEffect, useRef, useState } from 'react';
import { createContextSelector } from '@utils/createContextSelector';
import {
  INITIAL_UI_BOTTOM_SHEET_INFORMATION,
  INITIAL_SELECTED_TOKENS,
  INITIAL_SELECTED_TOKENS_AMOUNT,
  INITIAL_SETTINGS
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

  const [_refSettingsGetter, setSettings] = useState(INITIAL_SETTINGS);
  const [isProcessingSwap, setIsProcessingSwap] = useState(false);
  const [isIncreasingAllowance, setIsIncreassingAllowance] = useState(false);
  const [isMultiHopSwapBetterCurrency, setIsMultiHopSwapCurrencyBetter] =
    useState({ state: false, token: '' });

  // Swap preview information
  const [_refPairsGetter, setPairs] = useState<SelectedPairsState>([]);
  const [uiBottomSheetInformation, setUiBottomSheetInformation] = useState(
    INITIAL_UI_BOTTOM_SHEET_INFORMATION
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
    setUiBottomSheetInformation(INITIAL_UI_BOTTOM_SHEET_INFORMATION);
    setIsExactIn(true);
    setIsMultiHopSwapCurrencyBetter({ state: false, token: '' });
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
    isMultiHopSwapBetterCurrency,
    setIsMultiHopSwapCurrencyBetter,
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
