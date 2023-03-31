import React from 'react';
import { Row, Text } from '@components/base';
import { TextProps } from '@components/base/Text/Text.types';
import { TrendIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { NumberUtils } from '@utils/number';

interface PercentChangeProps
  extends Pick<TextProps, 'fontSize' | 'fontWeight'> {
  change: number;
  color?: string;
}

export function PercentChange(props: PercentChangeProps): JSX.Element {
  const {
    change,
    color = COLORS.black,
    fontSize = 12,
    fontWeight = '500'
  } = props;

  return (
    <Row alignItems="center">
      <TrendIcon color={color} type={change >= 0 ? 'up' : 'down'} />
      <Text fontSize={fontSize} fontWeight={fontWeight} color={color}>
        {' '}
        {NumberUtils.formatNumber(change, 2)}%
      </Text>
    </Row>
  );
}
