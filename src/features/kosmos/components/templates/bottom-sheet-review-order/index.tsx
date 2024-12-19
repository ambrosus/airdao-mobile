import React, { forwardRef, ReactNode, useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { Row, Spacer, Text } from '@components/base';
import { useForwardedRef } from '@hooks';
import { COLORS } from '@constants/colors';
import { TokenLogo } from '@components/modular';
import {
  $discount,
  discountColor,
  formatDecimals
} from '@features/kosmos/utils';
import { Status } from '@features/bridge/templates/BridgeTransaction/components/Status/Status';
import {
  _timestampToDate,
  Token,
  TxType,
  useTokensStore,
  VESTINGS
} from '@entities/kosmos';
import { environment, NumberUtils, StringUtils } from '@utils';

const ADDRESS_LEFT_PADDING = 5;
const ADDRESS_RIGHT_PADDING = 4;

interface BottomSheetReviewOrderProps {
  transaction: TxType;
  payoutToken: Token | undefined;
  quoteToken: Token | undefined;
  amount: string;
  payout: string;
}

export const BottomSheetReviewOrder = forwardRef<
  BottomSheetRef,
  BottomSheetReviewOrderProps
>(({ transaction, payout, amount, payoutToken, quoteToken }, ref) => {
  const { t } = useTranslation();
  const { bottom: bottomInset } = useSafeAreaInsets();

  const { tokens } = useTokensStore();

  const bottomSheetRef = useForwardedRef(ref);

  const usdPayoutPrice = useMemo(() => {
    return +payout * (payoutToken?.price || 0);
  }, [payout, payoutToken?.price]);

  const vestingEndsDate = useMemo(() => {
    return transaction.vestingType === 'Fixed-expiry'
      ? +transaction.vesting
      : +transaction.vesting + transaction.date;
  }, [transaction.date, transaction.vesting, transaction.vestingType]);

  const isVestingPass = useMemo(() => {
    return vestingEndsDate * 1000 < new Date().getTime();
  }, [vestingEndsDate]);

  const status = useMemo(() => {
    const { isClaimed } = transaction;
    if (isClaimed) return 'claimed';
    if (!isVestingPass) return 'claim pending';

    return 'ready to claim';
  }, [isVestingPass, transaction]);

  const lockPeriod = useMemo(() => {
    if (!transaction.vesting) return null;

    const vestings = VESTINGS[environment];

    return vestings.find((el) => el.value === +transaction.vesting)?.label;
  }, [transaction.vesting]);

  return (
    <BottomSheet
      title={t('common.details')}
      ref={bottomSheetRef}
      swipingEnabled={false}
    >
      <View style={[styles.container, { paddingBottom: bottomInset }]}>
        <View style={styles.innerContainer}>
          <Row alignItems="center" justifyContent="space-between">
            <StyledTextItem>{t('kosmos.bought')}</StyledTextItem>
            <Row style={styles.bondsRowGap} alignItems="center">
              <TokenLogo scale={0.5} token={quoteToken?.symbol ?? ''} />
              <StyledTextItem isValue>{amount}</StyledTextItem>
            </Row>
          </Row>
          <Row alignItems="center" justifyContent="space-between">
            <StyledTextItem>
              {t('kosmos.table.headings.discount')}
            </StyledTextItem>
            <StyledTextItem color={discountColor(transaction.discount)}>
              {$discount(transaction.discount)}
            </StyledTextItem>
          </Row>
          <Row alignItems="center" justifyContent="space-between">
            <StyledTextItem>{t('kosmos.payout')}</StyledTextItem>
            <Row alignItems="center">
              <StyledTextItem isValue>
                {NumberUtils.numberToTransformedLocale(
                  formatDecimals(payout, payoutToken?.contractAddress, tokens)
                )}{' '}
                {payoutToken?.symbol}
              </StyledTextItem>
              <Spacer horizontal value={4} />
              <StyledTextItem>{usdPayoutPrice.toFixed(2)}$</StyledTextItem>
            </Row>
          </Row>
          <Row alignItems="center" justifyContent="space-between">
            <StyledTextItem>{t('common.status')}</StyledTextItem>
            <Status status={status} />
          </Row>
          {transaction?.vestingType === 'Fixed-expiry' ? (
            <Row alignItems="center" justifyContent="space-between">
              <StyledTextItem>Vesting expired date</StyledTextItem>
              <StyledTextItem isValue>
                {_timestampToDate(+transaction.vesting)}
              </StyledTextItem>
            </Row>
          ) : (
            <Row alignItems="center" justifyContent="space-between">
              <StyledTextItem>{t('kosmos.lock.period')}</StyledTextItem>
              <StyledTextItem isValue>{lockPeriod}</StyledTextItem>
            </Row>
          )}
          <Row alignItems="center" justifyContent="space-between">
            <StyledTextItem>{t('kosmos.transaction.hash')}</StyledTextItem>
            <StyledTextItem color={COLORS.brand600}>
              {StringUtils.formatAddress(
                transaction.txHash,
                ADDRESS_LEFT_PADDING,
                ADDRESS_RIGHT_PADDING
              )}
            </StyledTextItem>
          </Row>
        </View>
      </View>
    </BottomSheet>
  );
});

const StyledTextItem = ({
  children,
  isValue = false,
  color
}: {
  children: ReactNode;
  isValue?: boolean;
  primary?: boolean;
  color?: string;
}) => {
  const _color = color || (isValue ? COLORS.neutral800 : COLORS.neutral400);

  const fontSize = color ? 14 : 15;
  const fontFamily = color ? 'Inter_600SemiBold' : 'Inter_500Medium';

  return (
    <Text fontSize={fontSize} fontFamily={fontFamily} color={_color}>
      {children}
    </Text>
  );
};
