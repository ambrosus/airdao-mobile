import React from 'react';
import { View } from 'react-native';
import { Row, Spacer, Text } from '@components/base';
import { Transaction } from '@models';
import { AssetLogo } from '@components/svg/icons/Asset';
import { styles } from '@components/templates/WalletTransactionsAndAssets/WalletAssets/SingleAsset/styles';
import { scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { NumberUtils } from '@utils/number';
import { useUSDPrice } from '@hooks';
import { StringUtils } from '@utils/string';

interface SingleTransactionProps {
  transaction: Transaction;
}

export const SingleTransaction = (
  props: SingleTransactionProps
): JSX.Element => {
  const { transaction } = props;
  const usdPrice = useUSDPrice(transaction?.amount || 0);

  return (
    <View style={styles.container}>
      <Row>
        <AssetLogo />
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
              -{NumberUtils.formatNumber(transaction.amount, 3)} AMB
            </Text>
          </Row>
          <Spacer horizontal value={scale(8)} />
          <Row justifyContent="space-between">
            <Text
              fontFamily="Inter_500Medium"
              fontSize={14}
              color={COLORS.gray400}
            >
              {/*@ts-ignore*/}
              To: {StringUtils.formatAddress(transaction.to?.address, 6, 5)}
            </Text>
            <Text
              fontFamily="Inter_400Regular"
              fontSize={14}
              color={COLORS.gray400}
            >
              ${NumberUtils.formatNumber(usdPrice, 2)}
            </Text>
          </Row>
        </View>
      </Row>
    </View>
  );
};
