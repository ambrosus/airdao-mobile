import { Keyboard } from 'react-native';
import { useSwapContextSelector } from '@features/swap/context';
import { FIELD, SelectedTokensKeys } from '@features/swap/types';

export function useSwapBottomSheetHandler() {
  const { bottomSheetTokenARef, bottomSheetTokenBRef } =
    useSwapContextSelector();

  const onShowBottomSheetByKey = (key: SelectedTokensKeys) => {
    Keyboard.dismiss();

    setTimeout(() => {
      key === FIELD.TOKEN_A
        ? bottomSheetTokenARef.current?.show()
        : bottomSheetTokenBRef.current?.show();
    }, 500);
  };

  const onDismissBottomSheetByKey = (key: SelectedTokensKeys) => {
    key === FIELD.TOKEN_A
      ? bottomSheetTokenARef.current?.dismiss()
      : bottomSheetTokenBRef.current?.dismiss();
  };

  const onDismissBottomSheets = () => {
    bottomSheetTokenARef.current?.dismiss();
    bottomSheetTokenBRef.current?.dismiss();
  };

  return {
    onDismissBottomSheetByKey,
    onShowBottomSheetByKey,
    onDismissBottomSheets
  };
}
