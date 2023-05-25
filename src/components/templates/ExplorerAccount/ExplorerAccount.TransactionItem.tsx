import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { TransactionDetails } from '../TransactionDetails';
import { Button, Spacer, Text } from '@components/base';
import { BottomSheetRef } from '@components/composite';
import { BottomSheetFloat, TransactionItem } from '@components/modular';
import { Transaction } from '@models/Transaction';
import { scale, verticalScale } from '@utils/scaling';

interface ExplorerAccountTransactionItemProps {
  transaction: Transaction;
  disabled?: boolean;
}

export const ExplorerAccountTransactionItem = (
  props: ExplorerAccountTransactionItemProps
): JSX.Element => {
  const { transaction, disabled = false } = props;
  const transactionDetailsModal = useRef<BottomSheetRef>(null);

  const showTransactionDetails = () => {
    transactionDetailsModal.current?.show();
  };

  return (
    <>
      <Button disabled={disabled} onPress={showTransactionDetails}>
        <TransactionItem transaction={transaction} />
      </Button>
      <BottomSheetFloat ref={transactionDetailsModal} swiperIconVisible>
        <View style={styles.transactionDetailsTop}>
          <Spacer value={verticalScale(26.46)} />
          <Text fontSize={20} fontFamily="Inter_700Bold" fontWeight="600">
            Transaction Details
          </Text>
        </View>
        <View style={styles.transactionDetails}>
          <TransactionDetails transaction={transaction} />
        </View>
      </BottomSheetFloat>
    </>
  );
};

const styles = StyleSheet.create({
  transactionDetailsTop: {
    alignSelf: 'center',
    alignItems: 'center'
  },
  transactionDetails: {
    paddingVertical: verticalScale(24),
    paddingHorizontal: scale(24)
  }
});
