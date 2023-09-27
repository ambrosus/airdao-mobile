import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TransactionDetails } from '../TransactionDetails';
import { Button, Spacer, Text } from '@components/base';
import { BottomSheetRef } from '@components/composite';
import { BottomSheetFloat, TransactionItem } from '@components/modular';
import { Transaction } from '@models/Transaction';
import { scale, verticalScale } from '@utils/scaling';
import { CommonStackNavigationProp } from '@appTypes/navigation/common';
import { useTranslation } from 'react-i18next';

interface ExplorerAccountTransactionItemProps {
  transaction: Transaction;
  disabled?: boolean;
}

export const ExplorerAccountTransactionItem = (
  props: ExplorerAccountTransactionItemProps
): JSX.Element => {
  const { transaction, disabled = false } = props;
  const transactionDetailsModal = useRef<BottomSheetRef>(null);
  const navigation = useNavigation<CommonStackNavigationProp>();
  const { t } = useTranslation();

  const showTransactionDetails = () => {
    transactionDetailsModal.current?.show();
  };

  const navigateToAddress = (address: string) => {
    transactionDetailsModal.current?.dismiss();
    // close first, navigate then
    setTimeout(() => {
      navigation.push('Address', { address });
    }, 0);
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
            {t('transaction.details')}
          </Text>
        </View>
        <View style={styles.transactionDetails}>
          <TransactionDetails
            onPressAddress={navigateToAddress}
            transaction={transaction}
          />
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
