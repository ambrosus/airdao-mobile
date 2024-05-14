import React, { useMemo } from 'react';
import { View, ViewProps } from 'react-native';
import { Row, Spacer, Text } from '@components/base';
import { PercentChange } from '@components/composite';
import { COLORS } from '@constants/colors';
import { useAMBPrice } from '@hooks';
import { AccountList } from '@models';
import { NumberUtils } from '@utils/number';
import { useTranslation } from 'react-i18next';

interface CollectionItemProps {
  collection: AccountList;
  style?: ViewProps['style'];
}

export function CollectionItem(props: CollectionItemProps) {
  const { collection, style } = props;
  const { data: ambPriceData } = useAMBPrice();
  const { t } = useTranslation();

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
      <Row alignItems="flex-end" justifyContent="space-between">
        <Text
          fontFamily="Inter_500Medium"
          fontSize={14}
          color={COLORS.neutral900}
          style={{ width: '70%' }}
          numberOfLines={1}
        >
          {collection.name}
        </Text>
        <Text
          style={{ lineHeight: 0 }}
          fontFamily="Inter_500Medium"
          fontSize={13}
          color={COLORS.neutral900}
        >
          {tokensFormatted}
        </Text>
      </Row>
      <Spacer value={4} />
      <Row justifyContent="space-between">
        <Text
          fontFamily="Inter_500Medium"
          color={COLORS.alphaBlack50}
          fontSize={12}
        >
          {' '}
          {t('common.address.with.count', { count: collection.accountCount })}
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
