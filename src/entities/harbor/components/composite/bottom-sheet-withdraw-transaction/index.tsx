import { PropsWithChildren, forwardRef, useCallback, useMemo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { ethers } from 'ethers';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CryptoCurrencyCode } from '@appTypes';
import { Row, Spacer, Text } from '@components/base';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { TokenLogo } from '@components/modular';
import { COLORS } from '@constants/colors';
import Config from '@constants/config';
import { useStakeHBRStore } from '@entities/harbor/model';
import { useWalletStore } from '@entities/wallet';
import { useForwardedRef } from '@hooks';
import { NumberUtils, StringUtils, verticalScale } from '@utils';
import { styles } from './styles';
import { SuccessTxView } from '../../base';

interface BottomSheetWithdrawTransactionProps extends PropsWithChildren {
  readonly amount: string;
  success: boolean;
  timestamp?: number;
  txHash?: string;
  loading: boolean;
  token: CryptoCurrencyCode.AMB | CryptoCurrencyCode.HBR;
  estimatedGas: ethers.BigNumber;
}

export const BottomSheetWithdrawTransaction = forwardRef<
  BottomSheetRef,
  BottomSheetWithdrawTransactionProps
>(
  (
    {
      amount,
      success,
      timestamp,
      txHash,
      loading,
      children,
      token,
      estimatedGas
    },
    ref
  ) => {
    const { t } = useTranslation();

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
      } catch (error) {
        throw error;
      }
    }, [hbrYieldFetcher, wallet?.address]);

    const transformedEstimatedGas = useMemo(() => {
      const parsedGas = NumberUtils.limitDecimalCount(
        ethers.utils.formatEther(estimatedGas),
        1
      );

      return `${parsedGas} ${CryptoCurrencyCode.AMB}`;
    }, [estimatedGas]);

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
              withdraw
              amount={amount}
              timestamp={timestamp}
              txHash={txHash}
              dismiss={dismiss}
              token={token}
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
                    {t('harbor.receive.amount.preview.title')}
                  </Text>
                  <Row alignItems="center">
                    <TokenLogo scale={0.75} token={token} />
                    <Spacer horizontal value={4} />
                    <Text
                      fontSize={14}
                      fontFamily="Inter_500Medium"
                      color={COLORS.neutral900}
                    >
                      {NumberUtils.numberToTransformedLocale(amount)} {token}
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
                    {StringUtils.formatAddress(
                      Config.HBR_LIQUIDITY_POOL ?? '',
                      10,
                      3
                    )}
                  </Text>
                </Row>
                <Row alignItems="center" justifyContent="space-between">
                  <Text
                    fontSize={14}
                    fontFamily="Inter_500Medium"
                    color={COLORS.neutral600}
                  >
                    {t('swap.bottom.sheet.lpfee')}
                  </Text>
                  <Text
                    fontSize={14}
                    fontFamily="Inter_500Medium"
                    color={COLORS.neutral900}
                  >
                    {transformedEstimatedGas}
                  </Text>
                </Row>
              </View>

              <View style={styles.footer}>{children}</View>
            </>
          )}
        </View>
      </BottomSheet>
    );
  }
);
