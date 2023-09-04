import React, { useRef } from 'react';
import { View } from 'react-native';
import { Button, Row, Spacer, Text } from '@components/base';
import { Transaction } from '@models';
import { AirDAOTokenLogo } from '@components/svg/icons/AirDAOTokenLogo';
import { styles } from '@components/templates/WalletTransactionsAndAssets/WalletAssets/SingleAsset/styles';
import { scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { NumberUtils } from '@utils/number';
import { useUSDPrice } from '@hooks';
import { StringUtils } from '@utils/string';
import { BottomSheetRef } from '@components/composite';
import { BottomSheetFloat } from '@components/modular';
import { TransactionModal } from '@components/templates';

interface SingleTransactionProps {
  transaction: Transaction;
}

export const SingleTransaction = (
  props: SingleTransactionProps
): JSX.Element => {
  const { transaction } = props;
  const usdPrice = useUSDPrice(transaction?.amount || transaction.value.ether);
  const transactionDetailsModal = useRef<BottomSheetRef>(null);

  const showTransactionDetails = () => {
    transactionDetailsModal.current?.show();
  };

  const onPress = () => {
    transactionDetailsModal.current?.dismiss();
  };

  return (
    <>
      <Button onPress={showTransactionDetails}>
        <View style={styles.container}>
          <Row>
            <AirDAOTokenLogo />
            <Spacer horizontal value={scale(8)} />
            <View style={styles.item}>
              <Row justifyContent="space-between">
                <Text
                  fontFamily="Inter_500Medium"
                  fontSize={16}
                  color={COLORS.nero}
                >
                  {transaction.status}
                </Text>
                <Text
                  fontFamily="Mersad_600SemiBold"
                  fontSize={16}
                  color={COLORS.nero}
                >
                  -
                  {NumberUtils.formatNumber(
                    transaction.amount || transaction.value.ether,
                    2
                  )}{' '}
                  AMB
                </Text>
              </Row>
              <Spacer horizontal value={scale(8)} />
              <Row justifyContent="space-between">
                <Text
                  fontFamily="Inter_500Medium"
                  fontSize={14}
                  color={COLORS.gray400}
                >
                  To:{' '}
                  {StringUtils.formatAddress(
                    // @ts-ignore
                    transaction.to?.address || transaction.to,
                    6,
                    5
                  )}
                </Text>
                <Text
                  fontFamily="Inter_400Regular"
                  fontSize={14}
                  color={COLORS.gray400}
                >
                  ${NumberUtils.formatNumber(usdPrice, usdPrice > 1 ? 2 : 4)}
                </Text>
              </Row>
            </View>
          </Row>
        </View>
      </Button>
      <BottomSheetFloat ref={transactionDetailsModal} swiperIconVisible>
        <TransactionModal
          transaction={transaction}
          status={transaction.status}
          onPress={onPress}
        />
      </BottomSheetFloat>
    </>
  );
};
