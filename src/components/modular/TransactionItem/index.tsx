import React from 'react';
import { Transaction } from '@models';
import { Row, Spacer, Text } from '@components/base';
import { verticalScale } from '@utils/scaling';
import dayjs from 'dayjs';

interface TransactionItemProps {
  transaction: Transaction;
}

export const TransactionItem = (props: TransactionItemProps): JSX.Element => {
  const { transaction } = props;

  return (
    <>
      <Row alignItems="center" justifyContent="space-between">
        <Text fontSize={13} fontFamily="Inter_600SemiBold">
          {transaction._id}
        </Text>
        <Text fontSize={13} fontFamily="Mersad_600SemiBold">
          {transaction.amount}
        </Text>
      </Row>
      <Spacer value={verticalScale(5)} />
      <Row alignItems="center" justifyContent="space-between">
        <Text fontSize={12} fontFamily="Inter_500Medium" color="#646464">
          {dayjs(transaction.timestamp).fromNow()}
        </Text>
        <Text fontSize={13} fontFamily="Mersad_600SemiBold" color="#646464">
          {transaction.fee} TxFee
        </Text>
      </Row>
    </>
  );
};
