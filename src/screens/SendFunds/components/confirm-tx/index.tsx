import React, { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Row, Spacer, Spinner, Text } from '@components/base';
import { PrimaryButton } from '@components/modular';
import { LogoGradientCircular } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { NumberUtils } from '@utils/number';
import { scale, verticalScale } from '@utils/scaling';
import { StringUtils } from '@utils/string';

interface ConfirmTransactionProps {
  from: string;
  to: string;
  etherAmount: number;
  usdAmount: number;
  currency: string;
  estimatedFee: number;
  loading: boolean;
  onSendPress: () => unknown;
}

const Title = (props: PropsWithChildren) => {
  return (
    <Text
      color={COLORS.neutral300}
      fontSize={16}
      fontFamily="Inter_600SemiBold"
    >
      {props.children}
    </Text>
  );
};

export const ConfirmTransaction = (props: ConfirmTransactionProps) => {
  const {
    from,
    to,
    etherAmount,
    usdAmount,
    currency,
    estimatedFee,
    loading,
    onSendPress
  } = props;
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Spacer value={verticalScale(16)} />
      <Text fontSize={20} color={COLORS.neutral800} fontFamily="Inter_700Bold">
        {t('send.funds.ready.to.send')}
      </Text>
      <Spacer value={verticalScale(24)} />
      <Row width="100%" alignItems="center" justifyContent="space-between">
        <Title>{t('common.transaction.from')}</Title>
        <Text
          color={COLORS.neutral800}
          fontFamily="Inter_500Medium"
          fontSize={16}
          fontWeight="500"
        >
          {StringUtils.formatAddress(from, 5, 6)}
        </Text>
      </Row>
      <Spacer value={verticalScale(16)} />
      <Row width="100%" alignItems="center" justifyContent="space-between">
        <Title>{t('common.transaction.to')}</Title>
        <Text
          color={COLORS.neutral800}
          fontFamily="Inter_500Medium"
          fontSize={16}
          fontWeight="500"
        >
          {StringUtils.formatAddress(to, 5, 6)}
        </Text>
      </Row>
      <Spacer value={verticalScale(16)} />
      <Row width="100%" alignItems="center" justifyContent="space-between">
        <Title>{t('common.transaction.amount')}</Title>
        <Row alignItems="center">
          <Text
            color={COLORS.neutral800}
            fontFamily="Inter_700Bold"
            fontSize={16}
            fontWeight="700"
          >
            {etherAmount} {currency}
          </Text>
          {usdAmount > 0 && (
            <>
              <Spacer value={scale(8)} horizontal />
              <Text
                color={COLORS.neutral400}
                fontSize={14}
                fontFamily="Inter_500Medium"
              >
                ${NumberUtils.formatNumber(usdAmount, 3)}
              </Text>
            </>
          )}
        </Row>
      </Row>
      <Spacer value={verticalScale(16)} />
      <Row width="100%" alignItems="center" justifyContent="space-between">
        <Title>{t('common.estimated.fee')}</Title>
        <Row alignItems="center">
          <LogoGradientCircular scale={0.67} />
          <Spacer value={scale(4)} horizontal />
          <Text
            color={COLORS.neutral700}
            fontFamily="Inter_600SemiBold"
            fontSize={14}
            fontWeight="600"
          >
            {estimatedFee}
            {' AMB'}
          </Text>
        </Row>
      </Row>
      <Spacer value={verticalScale(40)} />
      <PrimaryButton onPress={onSendPress} disabled={loading}>
        {loading ? (
          <Spinner />
        ) : (
          <Text color={COLORS.neutral0} fontSize={16}>
            {t('send.funds.send.now')}
          </Text>
        )}
      </PrimaryButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: scale(24),
    paddingBottom: verticalScale(42)
  }
});
