import React, { useRef } from 'react';
import { View } from 'react-native';
import dayjs from 'dayjs';
import { SharePortfolio } from '../BottomSheetSharePortfolio';
import { Button, Row, Spacer, Text } from '@components/base';
import { BottomSheetRef } from '@components/composite';
import { ShareIcon } from '@components/svg/icons';
import { Transaction } from '@models/Transaction';
import { NumberUtils } from '@utils/number';
import { StringUtils } from '@utils/string';
import { scale, verticalScale } from '@utils/scaling';
import { styles } from './styles';
import { COLORS } from '@constants/colors';

interface TransactionDetailsProps {
  transaction: Transaction;
}

const JustifiedRow = ({ children }: { children: React.ReactNode }) => (
  <Row alignItems="center" justifyContent="space-between">
    {children}
  </Row>
);

export const TransactionDetails = (
  props: TransactionDetailsProps
): JSX.Element => {
  const { transaction } = props;
  const shareTransactionModal = useRef<BottomSheetRef>(null);

  const showShareTransaction = () => {
    shareTransactionModal.current?.show();
  };
  if (!transaction) return <></>;

  return (
    <View testID="transaction-details">
      <JustifiedRow>
        <Text fontFamily="Inter_600SemiBold" fontSize={13} color="#646464">
          Method
        </Text>
        <Text fontFamily="Inter_600SemiBold" fontSize={16}>
          {transaction.type}
        </Text>
      </JustifiedRow>
      <Spacer value={verticalScale(28)} />
      <JustifiedRow>
        <Text fontFamily="Inter_600SemiBold" fontSize={13} color="#646464">
          Amount
        </Text>
        <Text fontFamily="Inter_600SemiBold" fontSize={16}>
          {NumberUtils.formatNumber(transaction.amount, 0)}
        </Text>
      </JustifiedRow>
      {transaction.from && (
        <>
          <Spacer value={verticalScale(28)} />
          <JustifiedRow>
            <Text fontFamily="Inter_600SemiBold" fontSize={13} color="#646464">
              From
            </Text>
            <Text
              color={COLORS.mainBlue}
              fontFamily="Inter_600SemiBold"
              fontSize={16}
              testID="transaction-details-from"
            >
              {StringUtils.formatAddress(transaction.from.address, 4, 5)}
            </Text>
          </JustifiedRow>
        </>
      )}
      {transaction.to && (
        <>
          <Spacer value={verticalScale(28)} />
          <JustifiedRow>
            <Text fontFamily="Inter_600SemiBold" fontSize={13} color="#646464">
              To
            </Text>
            <Text
              color={COLORS.mainBlue}
              fontFamily="Inter_600SemiBold"
              fontSize={16}
              testID="transaction-details-to"
            >
              {StringUtils.formatAddress(transaction.to.address, 4, 5)}
            </Text>
          </JustifiedRow>
        </>
      )}
      <Spacer value={verticalScale(28)} />
      <JustifiedRow>
        <Text fontFamily="Inter_600SemiBold" fontSize={13} color="#646464">
          TxHash
        </Text>
        <Text color="#222222" fontFamily="Inter_600SemiBold" fontSize={16}>
          {StringUtils.formatAddress(transaction.hash, 4, 4)}
        </Text>
      </JustifiedRow>
      <Spacer value={verticalScale(28)} />
      <JustifiedRow>
        <Text fontFamily="Inter_600SemiBold" fontSize={13} color="#646464">
          TxFee
        </Text>
        <Text color="#222222" fontFamily="Inter_600SemiBold" fontSize={16}>
          {transaction.fee}
        </Text>
      </JustifiedRow>
      <Spacer value={verticalScale(28)} />
      <JustifiedRow>
        <Text fontFamily="Inter_600SemiBold" fontSize={13} color="#646464">
          Time
        </Text>
        <Text fontFamily="Inter_600SemiBold" fontSize={16}>
          {dayjs(transaction.timestamp).fromNow()}
        </Text>
      </JustifiedRow>
      <Button
        type="circular"
        style={styles.shareBtn}
        onPress={showShareTransaction}
        testID="transaction-details-share-button"
      >
        <Row alignItems="center">
          <ShareIcon color="#000000" />
          <Spacer value={scale(3.5)} horizontal />
          <Text>Share transaction</Text>
        </Row>
      </Button>
      <SharePortfolio
        ref={shareTransactionModal}
        balance={NumberUtils.formatNumber(transaction.amount, 0)}
        currency="AMB"
        currencyPosition="right"
        txFee={transaction.fee}
        title="Transaction"
        bottomSheetTitle="Share Transaction"
        timestamp={transaction.timestamp}
      />
    </View>
  );
};
