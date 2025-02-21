import { ForwardedRef, forwardRef, useMemo, useState } from 'react';
import {
  BottomSheet,
  BottomSheetOutsideDataProps,
  BottomSheetRef,
  ModalActionTypes
} from '@components/composite';
import { useForwardedRef } from '@hooks';
import { PermissionsModal, PersonalSignModal } from './components';

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
