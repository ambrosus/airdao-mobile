import { useCallback } from 'react';
import { InteractionManager } from 'react-native';
import { useSwapContextSelector } from '@features/swap/context';
import { FIELD, SelectedTokensKeys, SwapToken } from '@features/swap/types';
import { useSwapBottomSheetHandler } from './use-swap-bottom-sheet-handler';
import { useSwapFieldsHandler } from './use-swap-fields-handler';

export function useSwapSelectTokens() {
  const {
    setSelectedTokens,
    selectedTokens,
    setSelectedTokensAmount,
    selectedTokensAmount,
    isExactIn
  } = useSwapContextSelector();

  const { updateReceivedTokensOutput } = useSwapFieldsHandler();

  const { onDismissBottomSheetByKey, onDismissBottomSheets } =
    useSwapBottomSheetHandler();

  const onSelectToken = useCallback(
    (key: SelectedTokensKeys, token: SwapToken) => {
      setSelectedTokens((prevSelectedTokens) => ({
        ...prevSelectedTokens,
        [key]: token
      }));

      InteractionManager.runAfterInteractions(() => {
        onDismissBottomSheetByKey(key);
      });

      setTimeout(async () => {
        await updateReceivedTokensOutput(isExactIn);
      }, 250);
    },
    [
      isExactIn,
      onDismissBottomSheetByKey,
      setSelectedTokens,
      updateReceivedTokensOutput
    ]
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
