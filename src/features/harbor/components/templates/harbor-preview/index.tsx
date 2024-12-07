import React, { forwardRef } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { Row, Spacer, Text } from '@components/base';
import { useForwardedRef } from '@hooks';
import { scale } from '@utils/scaling';
import { PrimaryButton, TokenLogo } from '@components/modular';
import { COLORS } from '@constants/colors';
import { StringUtils } from '@utils/string';
import { BottomSheetHarborPreViewProps } from '@features/harbor/components/templates/harbor-preview/models';

export const BottomSheetHarborPreView = forwardRef<
  BottomSheetRef,
  BottomSheetHarborPreViewProps
>(({ previewData, onAcceptPress }, ref) => {
  const { t } = useTranslation();
  const { bottom: bottomInset } = useSafeAreaInsets();
  const bottomSheetRef = useForwardedRef(ref);
  const {
    stakeAmount,
    receiveAmount,
    fromAddress,
    apy,
    receiveToken,
    stakeToken
  } = previewData;

  return (
    <BottomSheet
      title={t('common.review')}
      ref={bottomSheetRef}
      swipingEnabled={false}
    >
      <View style={[styles.container, { paddingBottom: bottomInset }]}>
        <View style={styles.wrapper}>
          <Row justifyContent="space-between">
            <Text style={styles.title}>
              {t('harbor.stake.amount.preview.title')}
            </Text>
            <Row alignItems="center">
              <TokenLogo token={stakeToken} scale={0.8} />
              <Text style={styles.valueText}>
                {stakeAmount} {stakeToken}
              </Text>
            </Row>
          </Row>
          <Spacer value={scale(16)} />

          <Row justifyContent="space-between">
            <Text style={styles.title}>
              {t('harbor.receive.amount.preview.title')}
            </Text>
            <Row alignItems="center">
              <TokenLogo token={receiveToken} scale={0.8} />
              <Text style={styles.valueText}>
                {receiveAmount} {receiveToken}
              </Text>
            </Row>
          </Row>
          <Spacer value={scale(16)} />

          <Row justifyContent="space-between">
            <Row justifyContent="center">
              <Text style={styles.title}>{t('harbor.stake.from')}</Text>
            </Row>
            <Text style={styles.valueText}>
              {StringUtils.formatAddress(fromAddress, 10, 4)}
            </Text>
          </Row>
          <Spacer value={scale(16)} />

          <Row justifyContent="space-between">
            <Text style={styles.title}>{t('harbor.stake.apy')}</Text>
            <Row>
              <Text style={{ ...styles.valueText, ...styles.apy }}>
                {apy} %
              </Text>
            </Row>
          </Row>
        </View>
        <Spacer value={scale(16)} />
        <PrimaryButton onPress={() => onAcceptPress(previewData)}>
          <Text color={COLORS.neutral0}>{t('staking.header')}</Text>
        </PrimaryButton>
      </View>
    </BottomSheet>
  );
});
