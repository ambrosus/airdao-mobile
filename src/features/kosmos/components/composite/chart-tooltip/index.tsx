import React, { useMemo } from 'react';
import { Platform, View } from 'react-native';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { DEVICE_HEIGHT, DEVICE_WIDTH } from '@constants/variables';
import { TooltipState } from '../../modular/market-chart/types';
import { Row, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { ChartStrokedArrow } from '../../base';
import { discountColor } from '@features/kosmos/utils';
import {
  RECT_HEIGHT,
  RECT_WIDTH,
  TRIANGLE_HEIGHT,
  TRIANGLE_WIDTH
} from '@entities/kosmos';

interface ChartTooltipProps {
  tooltip: TooltipState;
}

export const ChartTooltip = React.memo(({ tooltip }: ChartTooltipProps) => {
  const { t } = useTranslation();

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
    const isRightDirection = rectX === tooltip.x + TRIANGLE_WIDTH;

    const rightDirectionLeftAxis =
      rectX - TRIANGLE_WIDTH + (Platform.OS === 'android' ? 3 : -5);

    const leftDirectionLeftAxis =
      rectX + RECT_WIDTH - (Platform.OS === 'android' ? 1 : 5);

    const commonStyles = {
      top: tooltip.y - TRIANGLE_HEIGHT / 2,
      left: isRightDirection ? rightDirectionLeftAxis : leftDirectionLeftAxis,
      transform: [
        {
          rotate: Platform.select({
            ios: isRightDirection ? '90deg' : '-90deg',
            android: !isRightDirection ? '0deg' : '-180deg',
            default: '-90deg'
          })
        }
      ]
    };

    return commonStyles;
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

  return (
    <View style={styles.container}>
      <View style={innerContainerStyle}>
        {!!tooltip.value.market && (
          <Row alignItems="center" justifyContent="space-between">
            <Text fontSize={12} fontFamily="Inter_400Regular">
              {t('kosmos.chart.explanation.market')}:
            </Text>
            <Text fontSize={12} fontFamily="Inter_400Regular">
              ${tooltip.value.market.toFixed(4)}
            </Text>
          </Row>
        )}
        {!!tooltip.value.bond && (
          <Row alignItems="center" justifyContent="space-between">
            <Text fontSize={12} fontFamily="Inter_400Regular">
              {t('kosmos.chart.explanation.bond')}:
            </Text>
            <Text fontSize={12} fontFamily="Inter_400Regular">
              ${tooltip.value.bond?.toFixed(4)}
            </Text>
          </Row>
        )}
        {!!tooltip.value.discount && (
          <Row alignItems="center" justifyContent="space-between">
            <Text fontSize={12} fontFamily="Inter_400Regular">
              {t('kosmos.table.headings.discount')}:
            </Text>
            <Text
              color={discountColor(tooltip.value.discount)}
              fontSize={12}
              fontFamily="Inter_400Regular"
            >
              {tooltip.value.discount.toFixed(2)}%
            </Text>
          </Row>
        )}
        <Text
          fontSize={12}
          style={{ marginTop: 8 }}
          fontFamily="Inter_400Regular"
          color={COLORS.neutral800}
        >
          {date}
        </Text>
      </View>
      {Platform.OS === 'ios' ? (
        <View style={[styles.triangle, triangleStyle]} />
      ) : (
        <ChartStrokedArrow styles={triangleStyle} />
      )}
    </View>
  );
});
