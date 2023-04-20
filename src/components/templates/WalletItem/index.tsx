import React from 'react';
import { View } from 'react-native';
import { Row, Text } from '@components/base';
import { TrendIcon } from '@components/svg/icons';
import { NumberUtils } from '@utils/number';
import { ExplorerAccount } from '@models';
import { StringUtils } from '@utils/string';

export interface Wallet {
  title: string;
  price: number;
  totalAmount: number;
  currency: string;
  last24HourChange: number;
}
interface Props {
  item: Wallet | ExplorerAccount;
  isWatchlist?: boolean;
}

export function WalletItem(props: Props): JSX.Element {
  const { item, isWatchlist = false } = props;

  return (
    <View style={{ justifyContent: 'space-between', flex: 1 }}>
      <Row justifyContent="space-between">
        <Text fontWeight="600">
          {isWatchlist
            ? StringUtils.formatAddress(item?.address, 7, 9)
            : item.name || StringUtils.formatAddress(item.address, 5, 7)}
        </Text>
        <Text fontFamily="Mersad_600SemiBold">
          {isWatchlist
            ? StringUtils.pluralize(item.transactionCount, 'Transaction')
            : `$${NumberUtils.formatNumber(item.ambBalance, 0)}`}
        </Text>
      </Row>
      <Row justifyContent="space-between">
        <Text fontFamily="Mersad_600SemiBold" color="#2f2b4380" fontSize={13}>
          {isWatchlist
            ? `${NumberUtils.formatNumber(item.ambBalance, 0)} AMB`
            : `${NumberUtils.formatNumber(item.price, 0)} ${item.currency}`}
        </Text>
        <Row alignItems="center">
          <TrendIcon color="#2f2b4399" />
          {/* TODO progress */}
          <Text color="#2f2b4399"> 3.46%</Text>
        </Row>
      </Row>
    </View>
  );
}
