import React, { PropsWithChildren, forwardRef, useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CryptoCurrencyCode } from '@appTypes';
import { Row, Spacer, Text } from '@components/base';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { TokenLogo } from '@components/modular';
import { COLORS } from '@constants/colors';
import { useStakeHBRStore } from '@entities/harbor/model';
import { useWalletStore } from '@entities/wallet';
import { useForwardedRef, useContainerStyleWithSafeArea } from '@hooks';
import { NumberUtils, StringUtils } from '@utils';
import { styles } from './styles';
import { SuccessTxView } from '../../base';

interface BottomSheetReviewAMBTransactionProps extends PropsWithChildren {
  readonly amount: string;
  apy: number;
  success: boolean;
  timestamp?: number;
  txHash?: string;
  loading: boolean;
}

export const BottomSheetReviewAMBTransaction = forwardRef<
  BottomSheetRef,
  BottomSheetReviewAMBTransactionProps
>(({ amount, apy, success, timestamp, txHash, loading, children }, ref) => {
  const { t } = useTranslation();

  const { wallet } = useWalletStore();
  const { limitsConfig } = useStakeHBRStore();
  const containerStyle = useContainerStyleWithSafeArea(styles.container);

  const bottomSheetRef = useForwardedRef(ref);

  const dismiss = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.dismiss();
    }
  };

  const stakeLockPeriod = useMemo(
    () => (Number(limitsConfig?.stakeLockPeriod) / 86400).toFixed(0) || '0',
    [limitsConfig?.stakeLockPeriod]
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      title={success ? undefined : t('common.review')}
      closeOnBackPress={!loading}
      swipingEnabled={!loading}
    >
      <View style={containerStyle}>
        {success ? (
          <SuccessTxView
            apy={apy}
            amount={amount}
            txHash={txHash}
            dismiss={dismiss}
            timestamp={timestamp}
            stakeLockPeriod={stakeLockPeriod}
            token={CryptoCurrencyCode.stAMB}
          />
        ) : (
          <>
            <View style={styles.details}>
              {/*  First Row Item */}
              <Row alignItems="center" justifyContent="space-between">
                <Text
                  fontSize={14}
                  fontFamily="Inter_500Medium"
                  color={COLORS.neutral600}
                >
                  {t('staking.pool.stake.amount')}
                </Text>
                <Row alignItems="center">
                  <TokenLogo scale={0.75} token={CryptoCurrencyCode.AMB} />
                  <Spacer horizontal value={4} />
                  <Text
                    fontSize={14}
                    fontFamily="Inter_500Medium"
                    color={COLORS.neutral900}
                  >
                    {NumberUtils.limitDecimalCount(
                      NumberUtils.numberToTransformedLocale(amount),
                      3
                    )}{' '}
                    {CryptoCurrencyCode.AMB}
                  </Text>
                </Row>
              </Row>
              {/*  Second Row Item */}
              <Row alignItems="center" justifyContent="space-between">
                <Text
                  fontSize={14}
                  fontFamily="Inter_500Medium"
                  color={COLORS.neutral600}
                >
                  {t('kosmos.lock.period')}
                </Text>
                <Text
                  fontSize={14}
                  fontFamily="Inter_500Medium"
                  color={COLORS.neutral900}
                >
                  {stakeLockPeriod} {t('common.days')}
                </Text>
              </Row>
              {/*  Third Row Item */}
              <Row alignItems="center" justifyContent="space-between">
                <Text
                  fontSize={14}
                  fontFamily="Inter_500Medium"
                  color={COLORS.neutral600}
                >
                  {t('common.transaction.from')}
                </Text>
                <Text
                  fontSize={14}
                  fontFamily="Inter_500Medium"
                  color={COLORS.neutral900}
                >
                  {StringUtils.formatAddress(wallet?.address ?? '', 10, 3)}
                </Text>
              </Row>
              {/*  Fourth Row Item */}
              <Row alignItems="center" justifyContent="space-between">
                <Text
                  fontSize={14}
                  fontFamily="Inter_500Medium"
                  color={COLORS.neutral600}
                >
                  {t('staking.apy')}
                </Text>
                <Text
                  fontSize={14}
                  fontFamily="Inter_500Medium"
                  color={COLORS.success300}
                >
                  {apy}%
                </Text>
              </Row>
            </View>

            <View style={styles.footer}>{children}</View>
          </>
        )}
      </View>
    </BottomSheet>
  );
});
