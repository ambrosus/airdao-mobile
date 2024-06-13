import { useCallback, useEffect, useRef, useState } from 'react';
import { createContextSelector } from '@utils/createContextSelector';
import {
  INITIAL_SELECTED_TOKENS,
  INITIAL_SELECTED_TOKENS_AMOUNT,
  INITIAL_SLIPPAGE_TOLLERANCE
} from './initials';
import { BottomSheetRef } from '@components/composite';
import { SelectedTokensKeys } from '@/features/swap/types';

export const SwapContext = () => {
  const bottomSheetTokenARef = useRef<BottomSheetRef>(null);
  const bottomSheetTokenBRef = useRef<BottomSheetRef>(null);

  const [slippageTolerance, setSlippageTolerance] = useState(
    INITIAL_SLIPPAGE_TOLLERANCE
  );

  const [lastChangedInput, setLastChangedInput] =
    useState<SelectedTokensKeys | null>(null);
  const [selectedTokens, setSelectedTokens] = useState(INITIAL_SELECTED_TOKENS);

  const [selectedTokensAmount, setSelectedTokensAmount] = useState<
    Record<SelectedTokensKeys, string>
  >(INITIAL_SELECTED_TOKENS_AMOUNT);

  const latestSelectedTokens = useRef(selectedTokens);
  const latestSelectedTokensAmount = useRef(selectedTokensAmount);

  useEffect(() => {
    latestSelectedTokens.current = selectedTokens;
    latestSelectedTokensAmount.current = selectedTokensAmount;
  }, [selectedTokens, selectedTokensAmount]);

  const reset = useCallback(() => {
    setSelectedTokens(INITIAL_SELECTED_TOKENS);
    setSelectedTokensAmount(INITIAL_SELECTED_TOKENS_AMOUNT);
    setSlippageTolerance(INITIAL_SLIPPAGE_TOLLERANCE);
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
    reset
  };
};

export const [SwapContextProvider, useSwapContext] =
  createContextSelector(SwapContext);

export const useSwapContextSelector = () => useSwapContext((ctx) => ctx);
