import React, { useMemo } from 'react';
import { styles } from './styles';
import { Row, Spacer, Text } from '@components/base';
import { MarketType } from '@features/kosmos/types';
import { COLORS } from '@constants/colors';
import { useExtractToken } from '@features/kosmos/lib/hooks';
import { TokenLogo } from '@components/modular';
import { NumberUtils } from '@utils/number';

interface MarketListItemProps {
  market: MarketType;
}

interface StyledItemTextProps {
  align?: boolean;
  label?: string;
  color?: keyof typeof COLORS | string;
}

export const MarketListItem = React.memo(({ market }: MarketListItemProps) => {
  const { token } = useExtractToken(market.payoutToken);

  const discountItemColor = useMemo(() => {
    return market.discount > 0 ? COLORS.success500 : COLORS.error400;
  }, [market]);

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
          label={`${market.discount.toFixed(2)}%`}
          color={discountItemColor}
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
