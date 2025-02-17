import { RefObject } from 'react';
import { BottomSheetRef, ModalActionTypes } from '@components/composite';

interface ShowConfirmationModel {
  reject: () => void;
  resolve: () => void;
  browserApproveRef: RefObject<BottomSheetRef>;
  modalType: ModalActionTypes;
}

export const requestUserApproval = async ({
  reject,
  resolve,
  browserApproveRef,
  modalType
}: ShowConfirmationModel) => {
  browserApproveRef?.current?.show({
    modalType,
    onApprove: resolve,
    onReject: reject
  });
};
