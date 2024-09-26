import React, { useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TransactionDetails } from '../TransactionDetails';
import { Button, Spacer, Text } from '@components/base';
import { BottomSheetRef } from '@components/composite';
import { BottomSheetFloat, TransactionItem } from '@components/modular';
import { Transaction, TransactionTokenInfo } from '@models/Transaction';
import { scale, verticalScale } from '@utils/scaling';
import { CommonStackNavigationProp } from '@appTypes/navigation/common';
import { useTranslation } from 'react-i18next';
import { formatUnits } from 'ethers/lib/utils';
import { zeroAddress } from 'ethereumjs-util';
import { AMB_DECIMALS } from '@constants/variables';

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

  const hideTransactionDetails = () => {
    transactionDetailsModal.current?.dismiss();
  };

  const navigateToAddress = (address: string) => {
    transactionDetailsModal.current?.dismiss();
    // close first, navigate then
    setTimeout(() => {
      navigation.push('Address', { address });
    }, 0);
  };

  const transactionTokenInfo = useMemo((): TransactionTokenInfo => {
    if (transaction?.token) {
      return {
        ...transaction.token,
        cryptoAmount: formatUnits(
          transaction.value.wei,
          transaction.token.decimals
        )
      };
    }
    if (transaction.type === 'Transfer') {
      return {
        ...transaction.value,
        address: zeroAddress(),
        decimals: AMB_DECIMALS,
        cryptoAmount: formatUnits(transaction.value.wei, AMB_DECIMALS)
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
      <BottomSheetFloat ref={transactionDetailsModal} swiperIconVisible>
        <View style={styles.transactionDetailsTop}>
          <Spacer value={verticalScale(26.46)} />
          <Text fontSize={20} fontFamily="Inter_700Bold" fontWeight="600">
            {t('common.transaction.details')}
          </Text>
        </View>
        <View style={styles.transactionDetails}>
          <TransactionDetails
            transactionTokenInfo={transactionTokenInfo}
            onPressAddress={navigateToAddress}
            onViewOnExplorerPress={hideTransactionDetails}
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
