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
import { isIos, scale, StringUtils } from '@utils';
import { styles } from './styles';

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
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();

  const address = outsideModalData?.selectedAddress ?? '';

  const modalType = outsideModalData?.modalType || type;

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

  const getHeaderText = () => {
    switch (modalType) {
      case 'permissions':
        return t('browser.approve.permissions.header').replace(
          '{{uri}}',
          StringUtils.formatUri({ uri, formatLength: 10 })
        );
      case 'personalSign':
        return t('browser.approve.permissions.header').replace(
          '{{uri}}',
          StringUtils.formatUri({ uri, formatLength: 10 })
        );
      case 'sendTransaction':
        return t('browser.approve.permissions.header').replace(
          '{{uri}}',
          StringUtils.formatUri({ uri, formatLength: 10 })
        );
      default:
        return '';
    }
  };

  const getDescriptionText = () => {
    switch (modalType) {
      case 'permissions':
        return t('browser.approve.permission');
      case 'personalSign':
        return t('browser.approve.personal.sign');
      case 'sendTransaction':
        return t('browser.approve.send.transaction');
      default:
        return '';
    }
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
          {getHeaderText()}
        </Text>
        <Spacer value={scale(20)} />
        <Text color={COLORS.neutral900} fontSize={scale(15)}>
          {getDescriptionText()}
        </Text>
        <Spacer value={scale(5)} />
        <Row alignItems="center">
          <Text fontSize={scale(15)}>{t('browser.approve.address')} </Text>
          <View style={styles.addressWrapper}>
            <Text color={COLORS.neutral900} fontSize={scale(15)}>
              {StringUtils.formatAddress(address, 5, 5)}
            </Text>
          </View>
        </Row>
        <Spacer value={scale(20)} />
        <Row style={styles.buttonsWrapper} justifyContent="space-between">
          <SecondaryButton style={styles.button} onPress={onReject}>
            <Text style={styles.buttonText} color={COLORS.brand500}>
              {t('common.reject')}
            </Text>
          </SecondaryButton>
          <PrimaryButton style={styles.button} onPress={onApprove}>
            <Text style={styles.buttonText} color={COLORS.neutral0}>
              {t('common.approve')}
            </Text>
          </PrimaryButton>
        </Row>
      </View>
    </BottomSheet>
  );
});
