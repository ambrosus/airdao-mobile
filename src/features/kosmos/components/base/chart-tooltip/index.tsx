import React, { useMemo } from 'react';
import { View } from 'react-native';
import moment from 'moment';
import { styles } from './styles';
import { DEVICE_HEIGHT, DEVICE_WIDTH } from '@constants/variables';
import { TooltipState } from '../../modular/market-chart/types';
import { Row, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import {
  TRIANGLE_WIDTH,
  RECT_WIDTH,
  RECT_HEIGHT,
  TRIANGLE_HEIGHT
} from '@features/kosmos/constants';

interface ChartTooltipProps {
  tooltip: TooltipState;
}

export const ChartTooltip = React.memo(({ tooltip }: ChartTooltipProps) => {
  const date = useMemo(() => {
    return moment(tooltip.value.timestamp).format('DD/MM/YY HH:mm');
  }, [tooltip]);

  const rectX = useMemo(() => {
    const potentialX = tooltip.x + TRIANGLE_WIDTH;
    if (potentialX + RECT_WIDTH > DEVICE_WIDTH) {
      return tooltip.x - RECT_WIDTH - TRIANGLE_WIDTH;
    }
    return potentialX;
  }, [tooltip.x]);

  const rectY = useMemo(() => {
    const potentialY = tooltip.y - RECT_HEIGHT / 2;
    if (potentialY < 0) {
      return 0;
    } else if (potentialY + RECT_HEIGHT > DEVICE_HEIGHT) {
      return DEVICE_HEIGHT - RECT_HEIGHT;
    }
    return potentialY;
  }, [tooltip.y]);

  const triangleStyle = useMemo(() => {
    return {
      top: tooltip.y - TRIANGLE_HEIGHT / 2,
      left:
        rectX === tooltip.x + TRIANGLE_WIDTH
          ? rectX - TRIANGLE_WIDTH - 5
          : rectX + RECT_WIDTH - 5,
      transform: [
        {
          rotate: rectX === tooltip.x + TRIANGLE_WIDTH ? '90deg' : '-90deg'
        }
      ]
    };
  }, [rectX, tooltip.x, tooltip.y]);

  const innerContainerStyle = useMemo(() => {
    return [
      styles.tooltipContainer,
      {
        left: rectX,
        top: rectY
      }
    ];
  }, [rectX, rectY]);

  const discountTextColor = useMemo(() => {
    return tooltip.value.discount > 0 ? COLORS.success600 : COLORS.error600;
  }, [tooltip.value.discount]);

  return (
    <View style={styles.container}>
      <View style={innerContainerStyle}>
        <Row alignItems="center" justifyContent="space-between">
          <Text fontSize={12} fontFamily="Inter_400Regular">
            Market price:
          </Text>
          <Text fontSize={12} fontFamily="Inter_400Regular">
            ${tooltip.value.market.toFixed(4)}
          </Text>
        </Row>
        {!!tooltip.value.bond && (
          <Row alignItems="center" justifyContent="space-between">
            <Text fontSize={12} fontFamily="Inter_400Regular">
              Bond price:
            </Text>
            <Text fontSize={12} fontFamily="Inter_400Regular">
              ${tooltip.value.bond?.toFixed(4)}
            </Text>
          </Row>
        )}
        <Row alignItems="center" justifyContent="space-between">
          <Text fontSize={12} fontFamily="Inter_400Regular">
            Discount:
          </Text>
          <Text
            color={discountTextColor}
            fontSize={12}
            fontFamily="Inter_400Regular"
          >
            {tooltip.value.discount.toFixed(2)}%
          </Text>
        </Row>
        <Text
          fontSize={12}
          style={{ marginTop: 8 }}
          fontFamily="Inter_400Regular"
          color={COLORS.neutral800}
        >
          {date}
        </Text>
      </View>
      <View style={[styles.triangle, triangleStyle]} />
    </View>
  );
});
