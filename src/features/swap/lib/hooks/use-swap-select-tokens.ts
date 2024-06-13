import { useCallback } from 'react';
import { InteractionManager } from 'react-native';
import { useSwapContextSelector } from '@features/swap/context';
import { FIELD, SelectedTokensKeys, SwapToken } from '@features/swap/types';
import { useSwapBottomSheetHandler } from './use-swap-bottom-sheet-handler';

export function useSwapSelectTokens() {
  const {
    setSelectedTokens,
    selectedTokens,
    setSelectedTokensAmount,
    selectedTokensAmount,
    setLastChangedInput
  } = useSwapContextSelector();

  const { onDismissBottomSheetByKey, onDismissBottomSheets } =
    useSwapBottomSheetHandler();

  const onSelectToken = useCallback(
    async (key: SelectedTokensKeys, token: SwapToken) => {
      setLastChangedInput(key);
      setSelectedTokens((prevSelectedTokens) => ({
        ...prevSelectedTokens,
        [key]: token
      }));

      InteractionManager.runAfterInteractions(() => {
        onDismissBottomSheetByKey(key);
      });
    },
    [onDismissBottomSheetByKey, setLastChangedInput, setSelectedTokens]
  );

  const onReverseSelectedTokens = () => {
    setSelectedTokens({
      [FIELD.TOKEN_A]: selectedTokens.TOKEN_B,
      [FIELD.TOKEN_B]: selectedTokens.TOKEN_A
    });

    setSelectedTokensAmount({
      [FIELD.TOKEN_A]: selectedTokensAmount.TOKEN_B,
      [FIELD.TOKEN_B]: selectedTokensAmount.TOKEN_A
    });

    InteractionManager.runAfterInteractions(() => {
      onDismissBottomSheets();
    });
  };

  return { onSelectToken, onReverseSelectedTokens };
}
