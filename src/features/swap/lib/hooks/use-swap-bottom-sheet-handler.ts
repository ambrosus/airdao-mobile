import { useCallback } from 'react';
import { Keyboard } from 'react-native';
import { bnZERO } from '@constants/variables';
import { useSwapContextSelector } from '@features/swap/context';
import {
  BottomSheetStatus,
  FIELD,
  SelectedTokensKeys
} from '@features/swap/types';
import { useSwapAllBalances } from './use-swap-all-balances';

export function useSwapBottomSheetHandler() {
  const {
    bottomSheetTokenARef,
    bottomSheetTokenBRef,
    bottomSheetPreviewSwapRef,
    bottomSheetSwapStatus,
    setBottomSheetSwapStatus,
    setEstimatedGasValues
  } = useSwapContextSelector();

  const { fetchAllBalances } = useSwapAllBalances();

  const onChangeBottomSheetSwapStatus = useCallback(
    (status: BottomSheetStatus) => setBottomSheetSwapStatus(status),
    [setBottomSheetSwapStatus]
  );

  const onShowBottomSheetByKey = useCallback(
    (key: SelectedTokensKeys) => {
      Keyboard.dismiss();
      fetchAllBalances();

      setTimeout(() => {
        key === FIELD.TOKEN_A
          ? bottomSheetTokenARef.current?.show()
          : bottomSheetTokenBRef.current?.show();
      }, 500);
    },
    [bottomSheetTokenARef, bottomSheetTokenBRef, fetchAllBalances]
  );

  const onDismissBottomSheetByKey = useCallback(
    (key: SelectedTokensKeys) => {
      key === FIELD.TOKEN_A
        ? bottomSheetTokenARef.current?.dismiss()
        : bottomSheetTokenBRef.current?.dismiss();
    },
    [bottomSheetTokenARef, bottomSheetTokenBRef]
  );

  const onDismissBottomSheets = useCallback(() => {
    bottomSheetTokenARef.current?.dismiss();
    bottomSheetTokenBRef.current?.dismiss();
  }, [bottomSheetTokenARef, bottomSheetTokenBRef]);

  const onReviewSwapPreview = useCallback(() => {
    bottomSheetPreviewSwapRef.current?.show();
  }, [bottomSheetPreviewSwapRef]);

  const onReviewSwapDismiss = useCallback(() => {
    setEstimatedGasValues({ swap: bnZERO, approval: bnZERO });
    bottomSheetPreviewSwapRef.current?.dismiss();
  }, [bottomSheetPreviewSwapRef, setEstimatedGasValues]);

  return {
    onDismissBottomSheetByKey,
    onShowBottomSheetByKey,
    onDismissBottomSheets,
    onReviewSwapPreview,
    onReviewSwapDismiss,
    onChangeBottomSheetSwapStatus,
    bottomSheetSwapStatus
  };
}
