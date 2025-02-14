import { ForwardedRef, MutableRefObject } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacer, Text, Row } from '@components/base';
import {
  BottomSheetOutsideDataProps,
  BottomSheetRef
} from '@components/composite';
import { PrimaryButton, SecondaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { useBrowserStore } from '@entities/browser/model';
import { scale, StringUtils } from '@utils';
import { styles } from './styles';

interface PermissionsTypeProps {
  uri: string;
  localRef: MutableRefObject<BottomSheetRef | null>;
  outsideModalData?: BottomSheetOutsideDataProps;
}

export const PermissionsType = ({
  uri,
  localRef,
  outsideModalData
}: PermissionsTypeProps) => {
  const { selectedAddress } = useBrowserStore();
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();

  const onApprove = () => {
    if (outsideModalData?.onApprove) {
      outsideModalData.onApprove();
    }
    localRef?.current?.dismiss();
  };
  const onReject = () => {
    if (outsideModalData?.onReject) {
      outsideModalData.onReject();
    }
    localRef?.current?.dismiss();
  };
  return (
    <View style={[styles.main, { paddingBottom: bottom }]}>
      <Text align="center" color={COLORS.neutral900} fontSize={scale(17)}>
        {t('browser.approve.permissions.header').replace(
          '{{uri}}',
          StringUtils.formatUri({ uri, formatLength: 10 })
        )}
      </Text>
      <Spacer value={scale(20)} />
      <Text color={COLORS.neutral900} fontSize={scale(15)}>
        {t('browser.approve.permission')}
      </Text>
      <Spacer value={scale(5)} />
      <Row alignItems="center">
        <Text fontSize={scale(15)}>{t('browser.approve.address')} </Text>
        <View style={styles.addressWrapper}>
          <Text color={COLORS.neutral900} fontSize={scale(15)}>
            {StringUtils.formatAddress(selectedAddress, 5, 5)}
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
  );
};
