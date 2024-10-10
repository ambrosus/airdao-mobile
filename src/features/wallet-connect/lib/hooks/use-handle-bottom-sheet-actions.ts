import { useCallback } from 'react';
import { useWalletConnectContextSelector } from './use-wallet-connect-context';

export function useHandleBottomSheetActions() {
  const { approvalConnectionBottomSheetRef } =
    useWalletConnectContextSelector();

  const onToggleBottomSheet = useCallback(() => {
    approvalConnectionBottomSheetRef.current?.show();
  }, [approvalConnectionBottomSheetRef]);

  return { onToggleBottomSheet };
}
