import { useCallback } from 'react';
import { Keyboard } from 'react-native';
import { useSwapContextSelector } from '@features/swap/context';
import { FIELD, SelectedTokensKeys } from '@features/swap/types';

export function useSwapBottomSheetHandler() {
  const {
    bottomSheetTokenARef,
    bottomSheetTokenBRef,
    bottomSheetPreviewSwapRef
  } = useSwapContextSelector();

  const onShowBottomSheetByKey = useCallback(
    (key: SelectedTokensKeys) => {
      Keyboard.dismiss();

      setTimeout(() => {
        key === FIELD.TOKEN_A
          ? bottomSheetTokenARef.current?.show()
          : bottomSheetTokenBRef.current?.show();
      }, 500);
    },
    [bottomSheetTokenARef, bottomSheetTokenBRef]
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
    bottomSheetPreviewSwapRef.current?.dismiss();
  }, [bottomSheetPreviewSwapRef]);

  return {
    onDismissBottomSheetByKey,
    onShowBottomSheetByKey,
    onDismissBottomSheets,
    onReviewSwapPreview,
    onReviewSwapDismiss
  };
}
