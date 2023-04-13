import React from 'react';
import { View } from 'react-native';
import { Row, Text } from '@components/base';
import { TrendIcon } from '@components/svg/icons';
import { NumberUtils } from '@utils/number';
import { ListsOfAddressType } from '@appTypes/ListsOfAddressGroup';

interface WalletItemProps {
  item: ListsOfAddressType;
}

export function WalletItem(props: WalletItemProps): JSX.Element {
  const { item } = props;
  return (
    <View>
      <Row justifyContent="space-between">
        <Text fontWeight="600">{item.addressTitle}</Text>
        <Text fontFamily="Mersad_600SemiBold">
          ${NumberUtils.formatNumber(parseFloat(item.addressPrice), 0)}
        </Text>
      </Row>
      <Row justifyContent="space-between">
        <Text fontFamily="Mersad_600SemiBold" color="#2f2b4380" fontSize={13}>
          {NumberUtils.formatNumber(parseFloat(item.addressPrice), 0)} AMB
        </Text>
        <Row alignItems="center">
          <TrendIcon color="#2f2b4399" />
          <Text color="#2f2b4399"> {item.addressProgress}%</Text>
        </Row>
      </Row>
    </View>
  );
}
