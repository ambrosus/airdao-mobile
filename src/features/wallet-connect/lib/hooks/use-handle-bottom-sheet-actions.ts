import { useCallback } from 'react';
import { useWalletConnectContextSelector } from './use-wallet-connect-context';

export function useHandleBottomSheetActions() {
  const { approvalConnectionBottomSheetRef, reset } =
    useWalletConnectContextSelector();

  const onShowWalletConnectBottomSheet = useCallback(() => {
    approvalConnectionBottomSheetRef.current?.show();
  }, [approvalConnectionBottomSheetRef]);

  const onDismissWalletConnectBottomSheet = useCallback(() => {
    reset();
    approvalConnectionBottomSheetRef.current?.dismiss();
  }, [approvalConnectionBottomSheetRef, reset]);

  return { onShowWalletConnectBottomSheet, onDismissWalletConnectBottomSheet };
}
