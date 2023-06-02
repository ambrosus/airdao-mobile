import { Row, Spacer, Text } from '@components/base';
import React from 'react';
import { View } from 'react-native';
import { ExplorerAccount } from '@models/Explorer';
import { StringUtils } from '@utils/string';
import { NumberUtils } from '@utils/number';
import { verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

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
        <Text
          fontSize={14}
          fontFamily="Inter_500Medium"
          color={COLORS.smokyBlack}
        >
          {StringUtils.formatAddress(address, 7, 9)}
        </Text>
        <Text
          fontSize={13}
          fontFamily="Mersad_600SemiBold"
          color={COLORS.smokyBlack}
        >
          {NumberUtils.formatNumber(ambBalance, 0)} AMB
        </Text>
      </Row>
      <Spacer value={verticalScale(5)} />
      <Row alignItems="center" justifyContent="space-between">
        <Text
          fontSize={12}
          color={COLORS.smokyBlack50}
          fontFamily="Inter_500Medium"
        >
          Holding{' '}
          {NumberUtils.formatNumber(
            item.calculatePercentHoldings(totalSupply),
            2
          )}
          % of supply
        </Text>
        <Text
          fontSize={13}
          fontFamily="Inter_500Medium"
          color={COLORS.smokyBlack50}
        >
          {StringUtils.pluralize(transactionCount, 'Transaction')}
        </Text>
      </Row>
    </View>
  );
};
