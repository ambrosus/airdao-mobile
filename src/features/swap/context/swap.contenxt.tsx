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

  const [_refSettingsGetter, setSettings] = useState(INITAL_SETTINGS);

  const [uiBottomSheetInformation, setUiBottomSheetInformation] = useState(
    INITAL_UI_BOTTOM_SHEET_INFORMATION
  );

  const isExactInRef = useRef<boolean>(true);

  const [_refExactGetter, setIsExactIn] = useState(true);
  const [lastChangedInput, setLastChangedInput] = useState<SelectedTokensKeys>(
    FIELD.TOKEN_A
  );

  const [selectedTokens, setSelectedTokens] = useState(INITIAL_SELECTED_TOKENS);

  const [selectedTokensAmount, setSelectedTokensAmount] = useState<
    Record<SelectedTokensKeys, string>
  >(INITIAL_SELECTED_TOKENS_AMOUNT);

  const allPairsRef = useRef<SelectedPairsState>([]);
  const [_refPairsGetter, setPairs] = useState<SelectedPairsState>([]);

  const latestSelectedTokens = useRef(selectedTokens);
  const latestSelectedTokensAmount = useRef(selectedTokensAmount);

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
    setSettings(INITAL_SETTINGS);
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
    allPairsRef,
    setPairs,
    reset
  };
};

export const [SwapContextProvider, useSwapContext] =
  createContextSelector(SwapContext);

export const useSwapContextSelector = () => useSwapContext((ctx) => ctx);
