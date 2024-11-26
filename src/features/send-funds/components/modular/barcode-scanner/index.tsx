import React, { forwardRef } from 'react';
import { useForwardedRef } from '@hooks';
import { BarcodeScanner } from '@components/templates';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { DEVICE_HEIGHT } from '@constants/variables';

interface FundsBarcodeScannerProps {
  onScanned: (address: string) => void;
  onClose: () => void;
}

export const FundsBarcodeScanner = forwardRef<
  BottomSheetRef,
  FundsBarcodeScannerProps
>(({ onScanned, onClose }, ref) => {
  const bottomSheetRef = useForwardedRef(ref);
  return (
    <BottomSheet ref={bottomSheetRef} height={DEVICE_HEIGHT} borderRadius={0}>
      <BarcodeScanner onScanned={onScanned} onClose={onClose} />
    </BottomSheet>
  );
});
