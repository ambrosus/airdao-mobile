import { ForwardedRef, forwardRef, useState } from 'react';
import {
  BottomSheet,
  BottomSheetOutsideDataProps,
  BottomSheetProps,
  BottomSheetRef
} from '@components/composite';
import { AlertModalTemplate } from '@components/templates';
import { useForwardedRef } from '@hooks';
import { styles } from './styles';

export const BottomSheetBrowserModal = forwardRef<
  BottomSheetRef,
  BottomSheetProps
>((props, ref) => {
  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
  const [outsideModalData, setOutsideModalData] =
    useState<BottomSheetOutsideDataProps>({});

  const handlePress = (action?: () => void) => {
    localRef.current?.dismiss();
    action?.();
  };
  const onApprove = () => {
    handlePress(outsideModalData.onApprove);
    localRef.current?.dismiss();
  };
  const onReject = () => handlePress(outsideModalData.onReject);

  return (
    <BottomSheet
      ref={localRef}
      containerStyle={styles.bottomSheet}
      swiperIconVisible={false}
      fullscreen={true}
      swipingEnabled={false}
      height={'100%'}
      setOutsideModalData={setOutsideModalData}
    >
      <AlertModalTemplate
        title={outsideModalData?.title}
        subTitle={outsideModalData?.subTitle}
        buttonsLabels={outsideModalData?.buttonsLabels}
        onApprove={onApprove}
        onReject={onReject}
      />
    </BottomSheet>
  );
});
