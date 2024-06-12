import { useRef, useState } from 'react';
import { createContextSelector } from '@utils/createContextSelector';
import {
  INITIAL_SELECTED_TOKENS,
  INITIAL_SELECTED_TOKENS_AMOUNT
} from './initials';
import { BottomSheetRef } from '@components/composite';
import { SelectedTokensKeys } from '../types';

export const SwapContext = () => {
  const bottomSheetTokenARef = useRef<BottomSheetRef>(null);
  const bottomSheetTokenBRef = useRef<BottomSheetRef>(null);

  const [selectedTokens, setSelectedTokens] = useState(INITIAL_SELECTED_TOKENS);
  const [bnTokenBalance, setBnTokenBalance] = useState(null);

  const [selectedTokensAmount, setSelectedTokensAmount] = useState<
    Record<SelectedTokensKeys, string>
  >(INITIAL_SELECTED_TOKENS_AMOUNT);

  return {
    selectedTokens,
    setSelectedTokens,
    selectedTokensAmount,
    setSelectedTokensAmount,
    bnTokenBalance,
    setBnTokenBalance,
    bottomSheetTokenARef,
    bottomSheetTokenBRef
  };
};

export const [SwapContextProvider, useSwapContext] =
  createContextSelector(SwapContext);

export const useSwapContextSelector = () => useSwapContext((ctx) => ctx);
