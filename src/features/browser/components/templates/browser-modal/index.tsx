import { ForwardedRef, forwardRef, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Row, Text } from '@components/base';
import {
  BottomSheet,
  BottomSheetOutsideDataProps,
  BottomSheetProps,
  BottomSheetRef
} from '@components/composite';
import { PrimaryButton, SecondaryButton } from '@components/modular';
import { InfoIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { useForwardedRef } from '@hooks';
import { scale } from '@utils';
import { styles } from './styles';

export const BottomSheetBrowserModal = forwardRef<
  BottomSheetRef,
  BottomSheetProps
>((props, ref) => {
  const { t } = useTranslation();
  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
  const [outsideModalData, setOutsideModalData] =
    useState<BottomSheetOutsideDataProps>({});

  const handlePress = (action?: () => void) => {
    localRef.current?.dismiss();
    action?.();
  };
  const onApprove = () => handlePress(outsideModalData.onApprove);
  const onReject = () => handlePress(outsideModalData.onReject);

  return (
    <BottomSheet
      ref={localRef}
      containerStyle={styles.bottomSheet}
      swiperIconVisible={false}
      swipingEnabled={false}
      height={'100%'}
      setOutsideModalData={setOutsideModalData}
    >
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <InfoIcon scale={0.8} />
        </View>
        <Text
          fontSize={scale(20)}
          fontFamily="Inter_700Bold"
          color={COLORS.neutral800}
          align="center"
        >
          {outsideModalData?.title || t('bridge.transaction.confirmations')}
        </Text>
        {!!outsideModalData?.subTitle && (
          <Text
            fontSize={15}
            fontFamily="Inter_500Medium"
            color={COLORS.neutral800}
            align="center"
          >
            {outsideModalData?.subTitle}
          </Text>
        )}
        <Row width="100%" justifyContent={'space-around'}>
          <SecondaryButton
            style={styles.reject}
            onPress={() => handlePress(onReject)}
          >
            <Text color={COLORS.brand600}>
              {outsideModalData.buttonsLabels?.[1] || t('button.cancel')}
            </Text>
          </SecondaryButton>
          <PrimaryButton
            style={styles.approve}
            onPress={() => handlePress(onApprove)}
          >
            <Text color={COLORS.neutral0}>
              {outsideModalData?.buttonsLabels?.[0] || t('button.confirm')}
            </Text>
          </PrimaryButton>
        </Row>
      </View>
    </BottomSheet>
  );
});
