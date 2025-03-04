import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ethers } from 'ethers';
import {
  BottomSheetStatus,
  FIELD,
  SelectedPairsState,
  SelectedTokensKeys
} from '@/features/swap/types';
import { BottomSheetRef } from '@components/composite';
import { createContextSelector } from '@utils';
import {
  INITIAL_UI_BOTTOM_SHEET_INFORMATION,
  INITIAL_SELECTED_TOKENS_AMOUNT,
  INITIAL_SETTINGS
} from './initials';
import { SWAP_SUPPORTED_TOKENS } from '../entities';
import { addresses } from '../utils';
import { initialBalances } from '../utils/balances';

export const SwapContext = () => {
  const initialSelectedTokens = useMemo(
    () => ({
      TOKEN_A: SWAP_SUPPORTED_TOKENS.native,
      TOKEN_B: {
        address: addresses.USDC,
        name: 'USDC',
        symbol: 'USDC'
      }
    }),
    []
  );

  const bottomSheetTokenARef = useRef<BottomSheetRef>(null);
  const bottomSheetTokenBRef = useRef<BottomSheetRef>(null);
  const bottomSheetPreviewSwapRef = useRef<BottomSheetRef>(null);
  const isExactInRef = useRef<boolean>(true);
  const allPairsRef = useRef<SelectedPairsState>([]);
  const [isExecutingPrice, setIsExecutingPrice] = useState(false);
  const [isPoolsLoading, setIsPoolsLoading] = useState(false);

  const [bottomSheetSwapStatus, setBottomSheetSwapStatus] =
    useState<BottomSheetStatus>(BottomSheetStatus.PREVIEW);

  // Tokens connected states
  const [_refExactGetter, setIsExactIn] = useState(true);
  const [selectedTokens, setSelectedTokens] = useState(initialSelectedTokens);
  const [isWarningToEnableMultihopActive, setIsWarningToEnableMultihopActive] =
    useState(false);

  const [lastChangedInput, setLastChangedInput] = useState<SelectedTokensKeys>(
    FIELD.TOKEN_A
  );
  const [selectedTokensAmount, setSelectedTokensAmount] = useState<
    Record<SelectedTokensKeys, string>
  >(INITIAL_SELECTED_TOKENS_AMOUNT);

  const [balancesLoading, setBalancesLoading] = useState(false);
  const [balances, setBalances] =
    useState<Record<string, ethers.BigNumber>[]>(initialBalances);

  const [_refSettingsGetter, setSettings] = useState(INITIAL_SETTINGS);
  const [isProcessingSwap, setIsProcessingSwap] = useState(false);
  const [isIncreasingAllowance, setIsIncreasingAllowance] = useState(false);
  const [isMultiHopSwapBetterCurrency, setIsMultiHopSwapCurrencyBetter] =
    useState<{ state: boolean; tokens: string[] }>({
      state: false,
      tokens: []
    });

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
    const existingPairs = new Set(
      allPairsRef.current.map((pair) => JSON.stringify(pair))
    );
    const newPairs = _refPairsGetter.filter(
      (pair) => !existingPairs.has(JSON.stringify(pair))
    );

    allPairsRef.current = [...allPairsRef.current, ...newPairs];
  }, [_refPairsGetter]);

  const reset = useCallback(() => {
    setSelectedTokens(initialSelectedTokens);
    setSelectedTokensAmount(INITIAL_SELECTED_TOKENS_AMOUNT);
    setUiBottomSheetInformation(INITIAL_UI_BOTTOM_SHEET_INFORMATION);
    setIsExactIn(true);
    setIsMultiHopSwapCurrencyBetter({ state: false, tokens: [] });
    setIsWarningToEnableMultihopActive(false);
  }, [initialSelectedTokens]);

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
    setIsWarningToEnableMultihopActive,
    isWarningToEnableMultihopActive,
    setIsExactIn,
    isProcessingSwap,
    setIsProcessingSwap,
    isIncreasingAllowance,
    setIsIncreasingAllowance,
    allPairsRef,
    setPairs,
    reset,
    balances,
    setBalances,
    setBalancesLoading,
    balancesLoading,
    setBottomSheetSwapStatus,
    bottomSheetSwapStatus,
    isExecutingPrice,
    setIsExecutingPrice,
    isPoolsLoading,
    setIsPoolsLoading
  };
};

export const [SwapContextProvider, useSwapContext] =
  createContextSelector(SwapContext);

export const useSwapContextSelector = () => useSwapContext((ctx) => ctx);
