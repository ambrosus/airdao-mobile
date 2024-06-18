import { useCallback, useEffect, useRef, useState } from 'react';
import { createContextSelector } from '@utils/createContextSelector';
import {
  INITIAL_SELECTED_TOKENS,
  INITIAL_SELECTED_TOKENS_AMOUNT,
  INITIAL_SLIPPAGE_TOLLERANCE
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

  const isReversedMultiRouteRef = useRef<boolean>(false);
  const isExactInRef = useRef<boolean>(true);

  const [_refMultiRouteGetter, setIsReversedMultiRoute] = useState(false);
  const [slippageTolerance, setSlippageTolerance] = useState(
    INITIAL_SLIPPAGE_TOLLERANCE
  );

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
    isReversedMultiRouteRef.current = _refMultiRouteGetter;
  }, [_refMultiRouteGetter]);

  useEffect(() => {
    allPairsRef.current = _refPairsGetter;
  }, [_refPairsGetter]);

  const reset = useCallback(() => {
    setSelectedTokens(INITIAL_SELECTED_TOKENS);
    setSelectedTokensAmount(INITIAL_SELECTED_TOKENS_AMOUNT);
    setSlippageTolerance(INITIAL_SLIPPAGE_TOLLERANCE);
    setIsExactIn(true);
  }, []);

  return {
    selectedTokens,
    setSelectedTokens,
    selectedTokensAmount,
    setSelectedTokensAmount,
    slippageTolerance,
    setSlippageTolerance,
    lastChangedInput,
    latestSelectedTokens,
    latestSelectedTokensAmount,
    setLastChangedInput,
    bottomSheetTokenARef,
    bottomSheetTokenBRef,
    bottomSheetPreviewSwapRef,
    isExactInRef,
    isReversedMultiRouteRef,
    setIsReversedMultiRoute,
    setIsExactIn,
    allPairsRef,
    setPairs,
    reset
  };
};

export const [SwapContextProvider, useSwapContext] =
  createContextSelector(SwapContext);

export const useSwapContextSelector = () => useSwapContext((ctx) => ctx);
