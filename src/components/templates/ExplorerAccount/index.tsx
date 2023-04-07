import React from 'react';
import { View } from 'react-native';
import { Spacer, Text } from '@components/base';
import { ExplorerAccount } from '@models/Explorer';
import { verticalScale } from '@utils/scaling';
import { StringUtils } from '@utils/string';
import { useAMBPrice } from '@hooks/query';
import { NumberUtils } from '@utils/number';
import { styles } from './styles';

interface ExplorerAccountProps {
  account: ExplorerAccount;
  totalSupply: number;
}

export const ExplorerAccountView = (
  props: ExplorerAccountProps
): JSX.Element => {
  const { account, totalSupply } = props;
  const { address } = account;
  const { data } = useAMBPrice();
  const ambPriceUSD = data?.priceUSD || 0;

  const AMBBalance = account.ambBalance;
  const USDBalance = AMBBalance * ambPriceUSD;
  const percentage = (AMBBalance / totalSupply) * 100;

  return (
    <View style={styles.container}>
      <Text fontSize={15} fontFamily="Inter_600SemiBold">
        {StringUtils.formatAddress(address, 11, 5)}
      </Text>
      <Spacer value={verticalScale(12)} />
      <Text fontFamily="Mersad_600SemiBold" fontSize={36}>
        ${NumberUtils.formatNumber(USDBalance)}
      </Text>
      <Spacer value={verticalScale(12)} />
      <Text fontSize={12} fontWeight="500">
        {NumberUtils.formatNumber(AMBBalance, 2)} AMB
      </Text>
      <Spacer value={verticalScale(12)} />
      <Text fontSize={11} fontWeight="400">
        Holding {NumberUtils.formatNumber(percentage, 2)}% Supply
      </Text>
    </View>
  );
};
