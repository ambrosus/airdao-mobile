import React from 'react';
import { Transaction } from '@models';
import { Row, Spacer, Text } from '@components/base';
import { verticalScale } from '@utils/scaling';
import moment from 'moment';
import { COLORS } from '@constants/colors';

interface TransactionItemProps {
  transaction: Transaction;
}

export const TransactionItem = (props: TransactionItemProps): JSX.Element => {
  const { transaction } = props;

  return (
    <>
      <Row alignItems="center" justifyContent="space-between">
        <Text
          fontSize={14}
          fontFamily="Inter_500Medium"
          color={COLORS.smokyBlack}
        >
          {transaction.type}
        </Text>
        <Text
          fontSize={13}
          fontFamily="Mersad_600SemiBold"
          color={COLORS.smokyBlack}
        >
          {transaction.amount} AMB
        </Text>
      </Row>
      <Spacer value={verticalScale(4)} />
      <Row alignItems="center" justifyContent="space-between">
        <Text
          fontSize={12}
          fontFamily="Inter_500Medium"
          color={COLORS.smokyBlack50}
        >
          {moment(transaction.timestamp).fromNow()}
        </Text>
        <Text
          fontSize={12}
          fontFamily="Inter_500Medium"
          color={COLORS.smokyBlack50}
        >
          {transaction.fee} TxFee
        </Text>
      </Row>
    </>
  );
};
