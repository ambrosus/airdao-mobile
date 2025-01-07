import React, {
  PropsWithChildren,
  forwardRef,
  useCallback,
  useMemo
} from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CryptoCurrencyCode } from '@appTypes';
import { HarborNavigationProp } from '@appTypes/navigation/harbor';
import { Row, Spacer, Text } from '@components/base';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { TokenLogo } from '@components/modular';
import { COLORS } from '@constants/colors';
import { useStakeHBRStore } from '@entities/harbor/model';
import { useWalletStore } from '@entities/wallet';
import { useForwardedRef } from '@hooks';
import { StringUtils, _delayNavigation, verticalScale } from '@utils';
import { styles } from './styles';
import { SuccessTxView } from '../../base';

interface BottomSheetReviewTransactionProps extends PropsWithChildren {
  readonly amount: string;
  success: boolean;
  timestamp?: number;
  txHash?: string;
  loading: boolean;
}

export const BottomSheetReviewTransaction = forwardRef<
  BottomSheetRef,
  BottomSheetReviewTransactionProps
>(({ amount, success, timestamp, txHash, loading, children }, ref) => {
  const { t } = useTranslation();
  const navigation = useNavigation<HarborNavigationProp>();
  const { bottom } = useSafeAreaInsets();
  const { wallet } = useWalletStore();
  const { hbrYieldFetcher } = useStakeHBRStore();

  const bottomSheetRef = useForwardedRef(ref);

  const containerStyle = useMemo<StyleProp<ViewStyle>>(
    () => ({
      ...styles.container,
      paddingBottom: verticalScale(bottom === 0 ? 20 : bottom)
    }),
    [bottom]
  );

  const dismiss = useCallback(() => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.dismiss();
    }
  }, [bottomSheetRef]);

  const onDismissBottomSheet = useCallback(async () => {
    try {
      await hbrYieldFetcher(wallet?.address ?? '');
      _delayNavigation(dismiss, () => navigation.goBack());
    } catch (error) {
      throw error;
    }
  }, [dismiss, hbrYieldFetcher, navigation, wallet?.address]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      title={success ? undefined : t('common.review')}
      onBackdropPress={onDismissBottomSheet}
      closeOnBackPress={!loading}
      swipingEnabled={!loading}
    >
      <View style={containerStyle}>
        {success ? (
          <SuccessTxView
            amount={amount}
            timestamp={timestamp}
            txHash={txHash}
            dismiss={dismiss}
          />
        ) : (
          <>
            <View style={styles.details}>
              <Row alignItems="center" justifyContent="space-between">
                <Text
                  fontSize={14}
                  fontFamily="Inter_500Medium"
                  color={COLORS.neutral600}
                >
                  {t('staking.pool.stake.amount')}
                </Text>
                <Row alignItems="center">
                  <TokenLogo scale={0.75} token={CryptoCurrencyCode.HBR} />
                  <Spacer horizontal value={4} />
                  <Text
                    fontSize={14}
                    fontFamily="Inter_500Medium"
                    color={COLORS.neutral900}
                  >
                    {amount} {CryptoCurrencyCode.HBR}
                  </Text>
                </Row>
              </Row>

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
            </View>

            <View style={styles.footer}>{children}</View>
          </>
        )}
      </View>
    </BottomSheet>
  );
});
