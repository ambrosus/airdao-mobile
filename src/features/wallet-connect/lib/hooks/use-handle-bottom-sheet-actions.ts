import { useCallback } from 'react';
import { useWalletConnectContextSelector } from './use-wallet-connect-context';

export function useHandleBottomSheetActions() {
  const {
    approvalConnectionBottomSheetRef,
    activeSessionsBottomSheetRef,
    reset
  } = useWalletConnectContextSelector();

  // Approval Session Bottom Sheet
  const onShowWalletConnectBottomSheet = useCallback(() => {
    approvalConnectionBottomSheetRef.current?.show();
  }, [approvalConnectionBottomSheetRef]);

  const onDismissWalletConnectBottomSheet = useCallback(() => {
    reset();
    approvalConnectionBottomSheetRef.current?.dismiss();
  }, [approvalConnectionBottomSheetRef, reset]);
  // End of Approval Session Bottom Sheet

  // Sessions Bottom Sheet
  const onShowActiveSessionBottomSheet = useCallback(() => {
    activeSessionsBottomSheetRef.current?.show();
  }, [activeSessionsBottomSheetRef]);

  const onDismissActiveSessionBottomSheet = useCallback(() => {
    activeSessionsBottomSheetRef.current?.dismiss();
  }, [activeSessionsBottomSheetRef]);
  // End of Sessions Bottom Sheet

  return {
    onShowWalletConnectBottomSheet,
    onDismissWalletConnectBottomSheet,
    onShowActiveSessionBottomSheet,
    onDismissActiveSessionBottomSheet
  };
}
