import { RefObject } from 'react';
import { BottomSheetRef, ModalActionTypes } from '@components/composite';
import { delay } from '@utils';

interface ShowConfirmationModel {
  reject: () => void;
  resolve: () => void;
  browserApproveRef: RefObject<BottomSheetRef>;
  modalType: ModalActionTypes;
  selectedAddress: string;
}

export const requestUserApproval = async ({
  reject,
  resolve,
  browserApproveRef,
  modalType,
  selectedAddress
}: ShowConfirmationModel) => {
  await delay(400);
  browserApproveRef?.current?.show({
    modalType,
    selectedAddress,
    onApprove: resolve,
    onReject: reject
  });
};
