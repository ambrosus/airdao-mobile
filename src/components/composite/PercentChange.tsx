import React from 'react';
import { Row, Text } from '@components/base';
import { TextProps } from '@components/base/Text/Text.types';
import { TrendIcon } from '@components/svg/icons';
import { NumberUtils } from '@utils/number';
import { COLORS } from '@constants/colors';

interface PercentChangeProps
  extends Pick<TextProps, 'fontSize' | 'fontWeight'> {
  change: number;
  color?: string;
}

export function PercentChange(props: PercentChangeProps): JSX.Element {
  const { change, color = 'black', fontSize = 12, fontWeight = '500' } = props;

  return (
    <Row alignItems="center">
      <TrendIcon
        color={color || change >= 0 ? COLORS.crimsonRed : COLORS.jungleGreen}
        type={change >= 0 ? 'up' : 'down'}
      />
      <Text
        fontSize={fontSize}
        fontWeight={fontWeight}
        color={color || change >= 0 ? COLORS.crimsonRed : COLORS.jungleGreen}
      >
        {' '}
        {NumberUtils.formatNumber(change, 2)}%
      </Text>
    </Row>
  );
}
