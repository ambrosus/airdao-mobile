import React, { useMemo } from 'react';
import { View, ViewProps } from 'react-native';
import { Row, Spacer, Text } from '@components/base';
import { PercentChange } from '@components/composite';
import { COLORS } from '@constants/colors';
import { useAMBPrice } from '@hooks';
import { AccountList } from '@models';
import { NumberUtils } from '@utils/number';

interface CollectionItemProps {
  collection: AccountList;
  style?: ViewProps['style'];
}

export function CollectionItem(props: CollectionItemProps) {
  const { collection, style } = props;
  const { data: ambPriceData } = useAMBPrice();

  const tokensFormatted = useMemo(() => {
    const formattedNumber = NumberUtils.formatNumber(
      collection.totalBalance * (ambPriceData?.priceUSD || 0),
      0
    );
    return ambPriceData?.priceUSD
      ? `$${formattedNumber}`
      : `${NumberUtils.formatNumber(collection.totalBalance, 0)} AMB`;
  }, [ambPriceData?.priceUSD, collection.totalBalance]);

  return (
    <View style={style}>
      <Row alignItems="center" justifyContent="space-between">
        <Text
          fontFamily="Inter_500Medium"
          fontSize={14}
          color={COLORS.smokyBlack}
          style={{ width: '70%' }}
          numberOfLines={1}
        >
          {collection.name}
        </Text>
        <Text
          fontFamily="Mersad_600SemiBold"
          fontSize={13}
          color={COLORS.smokyBlack}
        >
          {tokensFormatted}
        </Text>
      </Row>
      <Spacer value={4} />
      <Row justifyContent="space-between">
        <Text
          fontFamily="Inter_500Medium"
          color={COLORS.smokyBlack50}
          fontSize={12}
        >
          {collection.accountCount + ' addresses'}
        </Text>
        {collection.accountCount > 0 && (
          <Row alignItems="center">
            <PercentChange change={ambPriceData?.percentChange24H || 0} />
          </Row>
        )}
      </Row>
    </View>
  );
}
