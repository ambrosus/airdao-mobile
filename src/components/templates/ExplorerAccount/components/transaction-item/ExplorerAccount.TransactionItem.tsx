import React, { useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { ethers } from 'ethers';
import moment from 'moment';
import { Button, Text } from '@components/base';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { TransactionItem } from '@components/modular';
import { Transaction, TransactionTokenInfo } from '@models/Transaction';
import { scale, verticalScale } from '@utils/scaling';
import { AMB_DECIMALS } from '@constants/variables';
import { COLORS } from '@constants/colors';
import { TransactionDetails } from '@components/templates/TransactionDetails';
import { _txStatusLabel } from '@features/explorer/utils';

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

  const transactionTokenInfo = useMemo((): TransactionTokenInfo => {
    if (transaction?.token) {
      return {
        ...transaction.token,
        cryptoAmount: ethers.utils.formatUnits(
          transaction.value.wei,
          transaction.token.decimals
        )
      };
    }
    if (transaction.type === 'Transfer') {
      return {
        ...transaction.value,
        address: ethers.constants.AddressZero,
        decimals: AMB_DECIMALS,
        cryptoAmount: ethers.utils.formatUnits(
          transaction.value.wei,
          AMB_DECIMALS
        )
      };
    }
    return {
      symbol: '',
      address: '',
      decimals: 0,
      cryptoAmount: String(transaction.amount) || '0'
    };
  }, [
    transaction.amount,
    transaction.token,
    transaction.type,
    transaction.value
  ]);

  return (
    <>
      <Button disabled={disabled} onPress={showTransactionDetails}>
        <TransactionItem
          transaction={transaction}
          transactionTokenInfo={transactionTokenInfo}
        />
      </Button>
      <BottomSheet
        ref={transactionDetailsModal}
        title={_txStatusLabel(transaction)}
      >
        <View style={styles.transactionDetails}>
          <Text
            fontSize={13}
            fontFamily="Inter_600SemiBold"
            color={COLORS.neutral500}
          >
            {moment(transaction.timestamp).format('MMM DD, YYYY - HH:mm')}
          </Text>
          <View style={styles.innerTransactionDetails}>
            <TransactionDetails
              transactionTokenInfo={transactionTokenInfo}
              transaction={transaction}
            />
          </View>
        </View>
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  transactionDetailsTop: {
    alignSelf: 'center',
    alignItems: 'center'
  },
  transactionDetails: {
    paddingTop: 2,
    paddingBottom: verticalScale(24),
    paddingHorizontal: scale(16)
  },
  innerTransactionDetails: {
    paddingTop: verticalScale(24)
  }
});
