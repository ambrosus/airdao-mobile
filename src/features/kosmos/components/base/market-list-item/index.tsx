import React, { memo, useMemo } from 'react';
import { View, Image, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { styles } from './styles';
import { Row, Text } from '@components/base';
import { MarketType, Token } from '@features/kosmos/types';
import { getTokenByAddress } from '@features/kosmos/utils';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';

interface MarketListItemProps {
  market: MarketType;
  tokens: Token[];
  index: number;
}

interface StyledItemTextProps {
  align?: boolean;
  label?: string;
  color?: keyof typeof COLORS | string;
}

const _MarketListItem = ({ market, tokens, index }: MarketListItemProps) => {
  const unwrapped = useMemo(() => {
    return getTokenByAddress(market.payoutToken, tokens);
  }, [tokens, market]);

  const discountItemColor = useMemo(() => {
    return market.discount > 0 ? COLORS.success600 : COLORS.error600;
  }, [market]);

  const combinedItemStyle: StyleProp<ViewStyle> = useMemo(() => {
    return {
      ...styles.container,
      marginTop: index === 0 ? 0 : verticalScale(16)
    };
  }, [index]);

  return (
    <View style={combinedItemStyle}>
      <Row style={styles.itemLabelContainer} alignItems="center">
        <Image src={unwrapped?.logoUrl} style={styles.logo} />
        <StyledItemText label={unwrapped?.symbol} />
      </Row>
      <StyledItemText
        label={`${market.discount.toFixed(2)}%`}
        color={discountItemColor}
      />
      <StyledItemText label={`$${market.askingPrice.toFixed(3)}`} />
    </View>
  );
};

const StyledItemText = ({
  align,
  label = '',
  color = COLORS.neutral600
}: StyledItemTextProps) => {
  const textItemStyle: StyleProp<TextStyle> = useMemo(() => {
    return {
      marginLeft: align ? scale(-16) : 0
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
