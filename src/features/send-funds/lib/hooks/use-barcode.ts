import { RefObject, useCallback } from 'react';
import { ethereumAddressRegex } from '@constants/regex';
import { useSendCryptoContext } from '@contexts';
import { BottomSheetRef } from '@components/composite';

export function useBarcode(
  barcodeScannerContainerRef: RefObject<BottomSheetRef>
) {
  const { state, reducer } = useSendCryptoContext((v) => v);

  const onDismissBarcodeContainer = useCallback(
    () => barcodeScannerContainerRef.current?.dismiss(),
    [barcodeScannerContainerRef]
  );

  const onShowBarcodeContainer = useCallback(
    () => barcodeScannerContainerRef.current?.show(),
    [barcodeScannerContainerRef]
  );

  const onScannedAddress = useCallback(
    (address: string) => {
      onDismissBarcodeContainer();
      const isAddress = ethereumAddressRegex.test(address);

      if (isAddress) {
        reducer({
          type: 'SET_DATA',
          ...state,
          to: address
        });
      }
    },
    [onDismissBarcodeContainer, reducer, state]
  );

  return {
    onScannedAddress,
    onDismissBarcodeContainer,
    onShowBarcodeContainer
  };
}
