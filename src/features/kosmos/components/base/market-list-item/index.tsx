import React, { useMemo } from 'react';
import { View, Image, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { styles } from './styles';
import { Row, Text } from '@components/base';
import { MarketType } from '@features/kosmos/types';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { useExtractToken } from '@features/kosmos/lib/hooks';

interface MarketListItemProps {
  market: MarketType;
  index: number;
}

interface StyledItemTextProps {
  align?: boolean;
  label?: string;
  color?: keyof typeof COLORS | string;
}

export const MarketListItem = React.memo(
  ({ market, index }: MarketListItemProps) => {
    const { token } = useExtractToken(market.payoutToken);

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
          <Image src={token?.logoUrl} style={styles.logo} />
          <StyledItemText label={token?.symbol} />
        </Row>
        <StyledItemText
          label={`${market.discount.toFixed(2)}%`}
          color={discountItemColor}
        />
        <StyledItemText label={`$${market.askingPrice.toFixed(3)}`} />
      </View>
    );
  }
);

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
