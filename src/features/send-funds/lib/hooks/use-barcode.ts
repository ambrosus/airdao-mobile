import { RefObject, useCallback } from 'react';
import { InteractionManager } from 'react-native';
import { ethereumAddressRegex } from '@constants/regex';
import { BottomSheetRef } from '@components/composite';
import { useSendFundsStore } from '@features/send-funds/model';

export function useBarcode(
  barcodeScannerContainerRef: RefObject<BottomSheetRef>
) {
  const { state, onChangeState } = useSendFundsStore();

  const onDismissBarcodeContainer = useCallback(
    () =>
      InteractionManager.runAfterInteractions(
        barcodeScannerContainerRef.current?.dismiss
      ),
    [barcodeScannerContainerRef]
  );

  const onShowBarcodeContainer = useCallback(
    () =>
      InteractionManager.runAfterInteractions(
        barcodeScannerContainerRef.current?.show
      ),
    [barcodeScannerContainerRef]
  );

  const onScannedAddress = useCallback(
    (address: string) => {
      onDismissBarcodeContainer();
      const isAddress = ethereumAddressRegex.test(address);

      if (isAddress) {
        onChangeState({
          ...state,
          to: address
        });
      }
    },
    [onChangeState, onDismissBarcodeContainer, state]
  );

  return {
    onScannedAddress,
    onDismissBarcodeContainer,
    onShowBarcodeContainer
  };
}
