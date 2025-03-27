import React, { ForwardedRef, forwardRef, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Row, Spacer, Text } from '@components/base';
import {
  BottomSheet,
  BottomSheetOutsideDataProps,
  BottomSheetRef
} from '@components/composite';
import { PrimaryButton, SecondaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { useForwardedRef } from '@hooks';
import { isIos, scale } from '@utils';
import { styles } from './styles';

export const BottomSheetRemovePermissions = forwardRef<BottomSheetRef>(
  ({}, ref) => {
    const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
    const [outsideModalData, setOutsideModalData] = useState(
      {} as BottomSheetOutsideDataProps
    );
    const { t } = useTranslation();
    const { bottom } = useSafeAreaInsets();

    const onApprove = () => {
      if (outsideModalData?.onApprove) {
        outsideModalData.onApprove();
      }
      localRef?.current?.dismiss();
    };

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
        <View
          style={[styles.main, { paddingBottom: isIos ? bottom : scale(15) }]}
        >
          <Text align="center" color={COLORS.neutral900} fontSize={scale(17)}>
            {t('browser.remove.permission.modal.header')}
          </Text>
          <Spacer value={scale(20)} />
          <Text align="center" color={COLORS.neutral900} fontSize={scale(15)}>
            {t('browser.remove.permission.modal.subheader')}
          </Text>
          <Spacer value={scale(30)} />

          <Row style={styles.buttonsWrapper} justifyContent="space-between">
            <SecondaryButton style={styles.button} onPress={onReject}>
              <Text style={styles.buttonText} color={COLORS.neutral800}>
                {t('common.reject')}
              </Text>
            </SecondaryButton>
            <PrimaryButton
              colors={[COLORS.error500, COLORS.error500]}
              style={styles.button}
              onPress={onApprove}
            >
              <Text style={styles.buttonText} color={COLORS.neutral0}>
                {t('common.approve')}
              </Text>
            </PrimaryButton>
          </Row>
        </View>
      </BottomSheet>
    );
  }
);
