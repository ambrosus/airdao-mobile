import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { TransactionDetails } from '../TransactionDetails';
import { Button, Spacer, Text } from '@components/base';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { TransactionItem } from '@components/modular';
import { BottomSheetSwiperIcon } from '@components/svg/icons';
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
      <Button
        testID="Transaction_Button"
        disabled={disabled}
        onPress={showTransactionDetails}
      >
        <TransactionItem transaction={transaction} />
      </Button>
      <BottomSheet ref={transactionDetailsModal} height={verticalScale(556.58)}>
        <View style={styles.transactionDetailsTop}>
          <BottomSheetSwiperIcon />
          <Spacer value={verticalScale(26.46)} />
          <Text fontSize={20} fontFamily="Inter_700Bold" fontWeight="600">
            Transaction Details
          </Text>
        </View>
        <View style={styles.transactionDetails}>
          <TransactionDetails transaction={transaction} />
        </View>
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  transactionDetailsTop: {
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: verticalScale(16.3)
  },
  transactionDetails: {
    flex: 1,
    paddingTop: verticalScale(31),
    paddingHorizontal: scale(21)
  }
});
