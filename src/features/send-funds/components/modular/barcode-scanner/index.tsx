import React, { forwardRef } from 'react';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { BarcodeScanner } from '@components/templates';
import { DEVICE_HEIGHT } from '@constants/variables';
import { useForwardedRef } from '@hooks';

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
