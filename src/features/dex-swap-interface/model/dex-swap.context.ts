import { useCallback, useEffect, useRef, useState } from 'react';
import { createContextSelector } from '@utils/createContextSelector';
import {
  INITIAL_SELECTED_TOKENS,
  INITIAL_SLIPPAGE_TOLERANCE,
  INITIAL_TOKENS_AMOUNT
} from './initial';
import { FIELD } from '../types/fields';
import { TokenInfo } from '../types';
import { BottomSheetRef } from '@components/composite';

import { DEXSwapInterfaceService } from '../service/dex-swap.service';

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

  const onApplyOppositeCurrencyAmount = useCallback(
    (key: keyof typeof FIELD, value: number | string) => {
      setSelectedTokensAmount((prevSelectedTokensAmount) => ({
        ...prevSelectedTokensAmount,
        [key]: String(value)
      }));
    },
    []
  );

  const onChangeSelectedTokensAmount = useCallback(
    async (key: keyof typeof FIELD, value: string) => {
      setLastChangedInput(key);
      const oppositeKey = key === FIELD.INPUT ? FIELD.OUTPUT : FIELD.INPUT;
      const isEmpty = value === '' || value === '0';

      setSelectedTokensAmount((prevSelectedTokensAmount) => ({
        ...prevSelectedTokensAmount,
        [key]: value
      }));

      if (selectedTokens.INPUT?.address && selectedTokens.OUTPUT?.address) {
        const receivedTokens = await DEXSwapInterfaceService.getAmountsOut({
          path: [selectedTokens.INPUT?.address, selectedTokens.OUTPUT?.address],
          amountToSell: value
        });

        if (selectedTokens[oppositeKey] && receivedTokens) {
          onApplyOppositeCurrencyAmount(
            oppositeKey,
            isEmpty ? '' : receivedTokens
          );
        }
      }
    },
    [onApplyOppositeCurrencyAmount, selectedTokens]
  );

  useEffect(() => {
    if (!lastChangedInput) return;

    const oppositeKey =
      lastChangedInput === FIELD.INPUT ? FIELD.OUTPUT : FIELD.INPUT;
    const oppositeValue = selectedTokensAmount[oppositeKey];

    const updateReceivedTokens = async () => {
      if (selectedTokens.INPUT?.address && selectedTokens.OUTPUT?.address) {
        const receivedTokens = await DEXSwapInterfaceService.getAmountsOut({
          path: [selectedTokens.INPUT?.address, selectedTokens.OUTPUT?.address],
          amountToSell: selectedTokensAmount[lastChangedInput]
        });

        if (selectedTokens[oppositeKey] && receivedTokens) {
          onApplyOppositeCurrencyAmount(
            oppositeKey,
            selectedTokensAmount[lastChangedInput] === '' ? '' : receivedTokens
          );
        }
      }
    };

    if (oppositeValue === '' && selectedTokens[oppositeKey]) {
      updateReceivedTokens();
      setLastChangedInput(null);
    }
  }, [
    selectedTokens,
    selectedTokensAmount,
    lastChangedInput,
    onApplyOppositeCurrencyAmount
  ]);

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
    onChangeSelectedTokensAmount,
    onApplyOppositeCurrencyAmount,
    setLastChangedInput,
    reset
  };
};

export const [DEXSwapContextProvider, useDEXSwapContext] =
  createContextSelector(DEXSwapContext);

export const useDEXSwapContextSelector = () => useDEXSwapContext((ctx) => ctx);
