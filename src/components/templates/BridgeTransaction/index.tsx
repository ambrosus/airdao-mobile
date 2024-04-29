import React from 'react';

import { Text, View } from 'react-native';
import { Transaction } from '@models';

import { styles } from './BridgeTransaction.style';
import { TokenLogo } from '@components/modular';
import { scale } from '@utils/scaling';
import { NumberUtils } from '@utils/number';
import { StringUtils } from '@utils/string';
import { Status } from './components/Status/Status';

interface BridgeTransactionModel {
  transaction: Transaction;
  disabled: boolean | undefined;
  index: number;
}

export const BridgeTransaction = (props: BridgeTransactionModel) => {
  const { transaction, index } = props;
  const { symbol, amount, to } = transaction;

  const formattingAmount = NumberUtils.limitDecimalCount(amount, 3);
  const formattingTo = StringUtils.formatAddress(to, 4, 5);

  return (
    <View style={styles.main}>
      <View style={styles.details}>
        <View style={styles.balance}>
          <TokenLogo scale={scale(0.6)} token={transaction.symbol} />
          <Text style={styles.amount}>{`${formattingAmount} ${symbol}`}</Text>
        </View>
        <Text style={styles.destination}>{formattingTo}</Text>
      </View>

      <Status status={index % 2 ? 'pending' : 'success'} />
    </View>
  );
};
