import React, { useMemo } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Row, Text } from '@components/base';
import { TokenLogo } from '@components/modular';
import { COLORS } from '@constants/colors';

interface MarketHeaderDetailsProps {
  tokenSymbol: string;
}

export const MarketHeaderDetails = React.memo(
  ({ tokenSymbol }: MarketHeaderDetailsProps) => {
    const rowStyle: StyleProp<ViewStyle> = useMemo(() => {
      return { gap: 8 };
    }, []);

    return (
      <Row style={rowStyle} alignItems="center">
        <TokenLogo scale={0.75} token={tokenSymbol} />
        <Text
          fontSize={16}
          fontFamily="Inter_600SemiBold"
          color={COLORS.neutral800}
        >
          {tokenSymbol}
        </Text>
      </Row>
    );
  }
);
