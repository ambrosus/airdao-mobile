import React from 'react';
import { View } from 'react-native';
import { Row, Text } from '@components/base';
import { TrendIcon } from '@components/svg/icons';
import { NumberUtils } from '@utils/number';
import { ExplorerAccount } from '@models/Explorer';
import { StringUtils } from '@utils/string';

interface WalletItemProps {
  item: ExplorerAccount;
}

export function WalletItem(props: WalletItemProps): JSX.Element {
  const { item } = props;
  return (
    <View>
      <Row justifyContent="space-between">
        <Text fontWeight="600">
          {item.name || StringUtils.formatAddress(item.address, 5, 7)}
        </Text>
        <Text fontFamily="Mersad_600SemiBold">
          ${NumberUtils.formatNumber(item.ambBalance, 0)}
        </Text>
      </Row>
      <Row justifyContent="space-between">
        <Text fontFamily="Mersad_600SemiBold" color="#2f2b4380" fontSize={13}>
          {NumberUtils.formatNumber(item.ambBalance, 0)} AMB
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
