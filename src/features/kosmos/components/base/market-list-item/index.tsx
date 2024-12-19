import React from 'react';
import { styles } from './styles';
import { Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { TokenLogo } from '@components/modular';
import { NumberUtils } from '@utils';
import { MarketType, useToken } from '@entities/kosmos';
import { $discount, discountColor } from '@features/kosmos/utils';

interface MarketListItemProps {
  market: MarketType;
}

interface StyledItemTextProps {
  align?: boolean;
  label?: string;
  color?: keyof typeof COLORS | string;
}

export const MarketListItem = React.memo(({ market }: MarketListItemProps) => {
  const { token } = useToken(market.payoutToken);

  return (
    <Row
      style={styles.container}
      alignItems="center"
      justifyContent="space-between"
    >
      <Row width="40%" alignItems="center">
        <TokenLogo scale={0.75} token={token?.symbol ?? ''} />
        <Spacer horizontal value={10} />
        <StyledItemText label={token?.symbol} />
      </Row>

      <Row width="58.75%" alignItems="center" justifyContent="space-between">
        <StyledItemText
          label={$discount(market.discount)}
          color={discountColor(market.discount)}
        />
        <StyledItemText
          label={`$${NumberUtils.numberToTransformedLocale(
            market.askingPrice.toFixed(3)
          )}`}
        />
      </Row>
    </Row>
  );
});

const StyledItemText = ({
  label = '',
  color = COLORS.neutral800
}: StyledItemTextProps) => {
  return (
    <Text fontSize={16} fontFamily="Inter_500Medium" color={color}>
      {label}
    </Text>
  );
};
