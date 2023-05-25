import React from 'react';
import { View } from 'react-native';
import { Row, Spacer, Text } from '@components/base';
import { NumberUtils } from '@utils/number';
import { ExplorerAccount } from '@models/Explorer';
import { StringUtils } from '@utils/string';
import { useAMBPrice } from '@hooks';
import { PercentChange } from '@components/composite';
import { COLORS } from '@constants/colors';

interface WalletItemProps {
  item: ExplorerAccount;
  isPortfolioFlow?: boolean;
}

export function WalletItem(props: WalletItemProps): JSX.Element {
  const { data } = useAMBPrice();
  const { item } = props;
  return (
    <View style={{ justifyContent: 'space-between' }}>
      <Row justifyContent="space-between">
        <Text
          fontFamily="Inter_600SemiBold"
          fontSize={13}
          color={COLORS.smokyBlack}
        >
          {item.name || StringUtils.formatAddress(item.address, 5, 7)}
        </Text>
        <Text
          fontFamily="Mersad_600SemiBold"
          fontSize={13}
          color={COLORS.smokyBlack}
        >
          ${NumberUtils.formatNumber(item.ambBalance, 0)}
        </Text>
      </Row>
      <Spacer value={5} />
      <Row justifyContent="space-between">
        <Text fontFamily="Mersad_600SemiBold" color="#0e0e0e80" fontSize={13}>
          {NumberUtils.formatNumber(item.ambBalance, 0)} AMB
        </Text>
        <Row alignItems="center">
          <PercentChange change={data?.percentChange24H || 0} />
        </Row>
      </Row>
    </View>
  );
}
