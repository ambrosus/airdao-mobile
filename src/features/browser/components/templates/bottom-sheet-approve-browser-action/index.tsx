import { ForwardedRef, forwardRef, useMemo, useState } from 'react';
import {
  BottomSheet,
  BottomSheetOutsideDataProps,
  BottomSheetRef,
  ModalActionTypes
} from '@components/composite';
import { PermissionsType } from '@features/browser/components/templates/bottom-sheet-approve-browser-action/components';
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
          <PermissionsType
            localRef={localRef}
            uri={uri}
            outsideModalData={outsideModalData}
          />
        );
      default:
        return null;
    }
  }, [localRef, modalType, outsideModalData, uri]);

  return (
    <BottomSheet
      ref={localRef}
      swiperIconVisible
      setOutsideModalData={setOutsideModalData}
    >
      {content}
    </BottomSheet>
  );
});
