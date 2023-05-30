import { Row, Spacer, Text } from '@components/base';
import React from 'react';
import { View } from 'react-native';
import { ExplorerAccount } from '@models/Explorer';
import { StringUtils } from '@utils/string';
import { NumberUtils } from '@utils/number';
import { verticalScale } from '@utils/scaling';

interface ExplorerWalletItemProps {
  item: ExplorerAccount;
  totalSupply: number;
}

export const ExplorerWalletItem = (
  props: ExplorerWalletItemProps
): JSX.Element => {
  const { item, totalSupply } = props;
  const { address, transactionCount, ambBalance } = item;
  return (
    <View>
      <Row alignItems="center" justifyContent="space-between">
        <Text fontSize={13} fontFamily="Inter_600SemiBold">
          {StringUtils.formatAddress(address, 7, 9)}
        </Text>
        <Text fontSize={13} fontFamily="Mersad_600SemiBold">
          {NumberUtils.formatNumber(ambBalance, 0)} AMB
        </Text>
      </Row>
      <Spacer value={verticalScale(5)} />
      <Row alignItems="center" justifyContent="space-between">
        <Text fontSize={12} color="#646464">
          Holding{' '}
          {NumberUtils.formatNumber(
            item.calculatePercentHoldings(totalSupply),
            2
          )}
          % of supply
        </Text>
        <Text
          fontSize={13}
          fontFamily="Mersad_600SemiBold"
          color="#2F2B43"
          opacity={0.5}
        >
          {StringUtils.pluralize(transactionCount, 'Transaction')}
        </Text>
      </Row>
    </View>
  );
};
