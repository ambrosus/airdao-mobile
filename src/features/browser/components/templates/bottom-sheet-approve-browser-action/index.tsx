import { ForwardedRef, forwardRef, useMemo, useState } from 'react';
import {
  BottomSheet,
  BottomSheetOutsideDataProps,
  BottomSheetRef,
  ModalActionTypes
} from '@components/composite';
import { PermissionsModal } from '@features/browser/components/templates/bottom-sheet-approve-browser-action/components';
import { PersonalSignModal } from '@features/browser/components/templates/bottom-sheet-approve-browser-action/components/approve-modals';
import { useForwardedRef } from '@hooks';

type Props = {
  uri: string;
  type?: string;
};

export const BottomSheetApproveBrowserAction = forwardRef<
  BottomSheetRef,
  Props
>(({ uri, type }, ref) => {
  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
  const [outsideModalData, setOutsideModalData] = useState(
    {} as BottomSheetOutsideDataProps
  );

  const modalType = outsideModalData?.modalType || type;
  const content = useMemo(() => {
    switch (modalType) {
      case ModalActionTypes.PERMISSIONS:
        return (
          <PermissionsModal
            localRef={localRef}
            address={outsideModalData?.selectedAddress ?? ''}
            uri={uri}
            outsideModalData={outsideModalData}
          />
        );
      case ModalActionTypes.PERSONAL_SIGN:
        return (
          <PersonalSignModal
            localRef={localRef}
            address={outsideModalData?.selectedAddress ?? ''}
            uri={uri}
            outsideModalData={outsideModalData}
          />
        );
      default:
        return null;
    }
  }, [localRef, modalType, outsideModalData, uri]);
  const onReject = () => {
    if (outsideModalData.onReject) {
      outsideModalData.onReject();
    }
    localRef?.current?.dismiss();
  };

  return (
    <BottomSheet
      onBackdropPress={onReject}
      ref={localRef}
      swiperIconVisible
      setOutsideModalData={setOutsideModalData}
    >
      {content}
    </BottomSheet>
  );
});
