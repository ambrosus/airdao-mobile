import React from 'react';
import { Row, Text } from '@components/base';
import { TextProps } from '@components/base/Text/Text.types';
import { NumberUtils } from '@utils/number';
import { COLORS } from '@constants/colors';

interface PercentChangeProps
  extends Pick<TextProps, 'fontSize' | 'fontWeight'> {
  change: number;
  color?: string;
}

export function PercentChange({
  change,
  color,
  fontSize = 12,
  fontWeight = '500'
}: PercentChangeProps): JSX.Element {
  return (
    <Row alignItems="center">
      <Text
        fontSize={fontSize}
        fontWeight={fontWeight}
        color={color || change >= 0 ? COLORS.success400 : COLORS.error400}
        testID="PercentChange_Title"
      >
        {`${NumberUtils.addSignToNumber(
          Number(NumberUtils.formatNumber(change, 2))
        )}%`}
      </Text>
    </Row>
  );
}
