import { Row, Text } from '@components/base';
import { TrendIcon } from '@components/svg/icons';
import React from 'react';
import { View } from 'react-native';
import { NumberUtils } from '../../../utils/number';

export interface Wallet {
  title: string;
  price: number;
  totalAmount: number;
  currency: string;
  last24HourChange: number;
}

interface WalletItemProps {
  item: Wallet;
}

export function WalletItem(props: WalletItemProps): JSX.Element {
  const { item } = props;
  return (
    <View>
      <Row justifyContent="space-between">
        <Text fontWeight="600">{item.title}</Text>
        <Text fontFamily="Mersad_600SemiBold">
          ${NumberUtils.formatNumber(item.totalAmount, 0)}
        </Text>
      </Row>
      <Row justifyContent="space-between">
        <Text fontFamily="Mersad_600SemiBold" color="#2f2b4380" fontSize={13}>
          {NumberUtils.formatNumber(item.price, 0)} {item.currency}
        </Text>
        <Row alignItems="center">
          <TrendIcon color="#2f2b4399" />
          <Text color="#2f2b4399"> {item.last24HourChange}%</Text>
        </Row>
      </Row>
    </View>
  );
}
