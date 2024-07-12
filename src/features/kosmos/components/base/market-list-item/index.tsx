import React, { memo, useMemo } from 'react';
import { View, Image, StyleProp, TextStyle } from 'react-native';
import { styles } from './styles';
import { Row, Text } from '@components/base';
import { MarketType, Token } from '@features/kosmos/types';
import { getTokenByAddress } from '@features/kosmos/utils';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';

interface MarketListItemProps {
  market: MarketType;
  tokens: Token[];
}

interface StyledItemTextProps {
  align?: boolean;
  label?: string;
  color?: keyof typeof COLORS | string;
}

const _MarketListItem = ({ market, tokens }: MarketListItemProps) => {
  const unwrapped = useMemo(() => {
    return getTokenByAddress(market.payoutToken, tokens);
  }, [tokens, market]);

  const discountItemColor = useMemo(() => {
    return market.discount > 0 ? COLORS.success600 : COLORS.error600;
  }, [market]);

  return (
    <View style={styles.container}>
      <Row style={styles.itemLabelContainer} alignItems="center">
        <Image src={unwrapped?.logoUrl} style={styles.logo} />
        <StyledItemText label={unwrapped?.symbol} />
      </Row>
      <StyledItemText
        align
        label={`${market.discount.toFixed(2)}%`}
        color={discountItemColor}
      />
      <StyledItemText label={market.discount.toFixed(2)} />
    </View>
  );
};

const StyledItemText = ({
  align,
  label = '',
  color = 'neutral600'
}: StyledItemTextProps) => {
  const textItemStyle: StyleProp<TextStyle> = useMemo(() => {
    return {
      marginLeft: align ? scale(-32) : 0
    };
  }, [align]);

  return (
    <Text
      style={textItemStyle}
      fontSize={16}
      fontFamily="Inter_500Medium"
      color={color}
    >
      {label}
    </Text>
  );
};

export const MarketListItem = memo(_MarketListItem);
