import React, { useCallback, useMemo, useRef } from 'react';
import { Pressable, View } from 'react-native';
import { BigNumber, ethers } from 'ethers';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { Row, Text } from '@components/base';
import { TokenLogo } from '@components/modular';
import { TxType } from '@features/kosmos/types';
import { formatDecimals, getTokenByAddress } from '@features/kosmos/utils';
import { useKosmosMarketsContextSelector } from '@features/kosmos/context';
import { COLORS } from '@constants/colors';
import { BottomSheetReviewOrder } from '@features/kosmos/components/templates/bottom-sheet-review-order';
import { BottomSheetRef } from '@components/composite';

interface OrderCardDetailsProps {
  transaction: TxType;
}

export const OrderCardDetails = ({ transaction }: OrderCardDetailsProps) => {
  const { t } = useTranslation();
  const { tokens } = useKosmosMarketsContextSelector();

  const bottomSheetRef = useRef<BottomSheetRef>(null);

  const quoteToken = useMemo(() => {
    const address = transaction.quoteToken;
    return getTokenByAddress(address, tokens);
  }, [transaction, tokens]);

  const payoutToken = useMemo(() => {
    const address = transaction.payoutToken;
    return getTokenByAddress(address, tokens);
  }, [transaction, tokens]);

  const amount = useMemo(() => {
    const amountBn = BigNumber.from(transaction.bondAmount);
    return ethers.utils.formatUnits(amountBn, quoteToken?.decimals);
  }, [quoteToken?.decimals, transaction.bondAmount]);

  const payout = useMemo(() => {
    const payoutBn = BigNumber.from(transaction.payoutAmount);
    return ethers.utils.formatUnits(payoutBn, payoutToken?.decimals);
  }, [payoutToken?.decimals, transaction.payoutAmount]);

  const onReviewOrderDetails = useCallback(() => {
    bottomSheetRef.current?.show();
  }, []);

  return (
    <>
      <Pressable
        style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
        onPress={onReviewOrderDetails}
      >
        <Row style={styles.innerRowContainer} alignItems="center">
          <TokenLogo scale={0.65} token={quoteToken?.symbol ?? ''} />
          <Text
            fontSize={16}
            fontFamily="Inter_600SemiBold"
            color={COLORS.neutral800}
          >
            {amount}
          </Text>
        </Row>

        <View style={styles.innerDetailsContainer}>
          <Row alignItems="center" justifyContent="space-between">
            <Text
              fontSize={12}
              fontFamily="Inter_500Medium"
              color={COLORS.neutral500}
            >
              {t('kosmos.table.headings.discount')}
            </Text>
            <Text
              fontSize={16}
              fontFamily="Inter_500Medium"
              color={COLORS.neutral700}
            >
              {transaction.discount.toFixed(2)}%
            </Text>
          </Row>
          <Row alignItems="center" justifyContent="space-between">
            <Text
              fontSize={12}
              fontFamily="Inter_500Medium"
              color={COLORS.neutral500}
            >
              {t('kosmos.payout')}
            </Text>
            <Text
              fontSize={14}
              fontFamily="Inter_500Medium"
              color={COLORS.neutral700}
            >
              {formatDecimals(payout, payoutToken?.contractAddress, tokens)}{' '}
              {payoutToken?.symbol.toUpperCase()}
            </Text>
          </Row>
        </View>
      </Pressable>

      <BottomSheetReviewOrder
        ref={bottomSheetRef}
        transaction={transaction}
        quoteToken={quoteToken}
        payoutToken={payoutToken}
        payout={payout}
        amount={amount}
      />
    </>
  );
};
