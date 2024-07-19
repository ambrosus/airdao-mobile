import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { scale } from '@utils/scaling';
import { DEVICE_HEIGHT, DEVICE_WIDTH } from '@constants/variables';

interface ChartTooltipProps {
  tooltipAxis: { x: number; y: number };
}

const RECT_WIDTH = scale(162);
const RECT_HEIGHT = 80;
const TRIANGLE_WIDTH = 10;
const TRIANGLE_HEIGHT = 10;

export const ChartTooltip = React.memo(({ tooltipAxis }: ChartTooltipProps) => {
  const rectX = useMemo(() => {
    const potentialX = tooltipAxis.x + TRIANGLE_WIDTH;
    if (potentialX + RECT_WIDTH > DEVICE_WIDTH) {
      return tooltipAxis.x - RECT_WIDTH - TRIANGLE_WIDTH;
    }
    return potentialX;
  }, [tooltipAxis.x]);

  const rectY = useMemo(() => {
    if (tooltipAxis.y + RECT_HEIGHT + TRIANGLE_HEIGHT > DEVICE_HEIGHT) {
      return DEVICE_HEIGHT - RECT_HEIGHT - TRIANGLE_HEIGHT;
    }
    return tooltipAxis.y > RECT_HEIGHT
      ? tooltipAxis.y - RECT_HEIGHT / 2
      : tooltipAxis.y;
  }, [tooltipAxis.y]);

  const triangleStyle = {
    top: tooltipAxis.y - TRIANGLE_HEIGHT / 2,
    transform: [
      {
        rotate:
          rectX === tooltipAxis.x - RECT_WIDTH - TRIANGLE_WIDTH
            ? '180deg'
            : '0deg'
      }
    ]
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.tooltipContainer,
          {
            left: rectX,
            top: rectY
          }
        ]}
      >
        <Text style={styles.tooltipText}>0.00</Text>
      </View>
      <View
        style={[
          styles.triangle,
          triangleStyle,
          {
            left:
              rectX === tooltipAxis.x - RECT_WIDTH - TRIANGLE_WIDTH
                ? tooltipAxis.x - TRIANGLE_WIDTH
                : tooltipAxis.x + RECT_WIDTH
          }
        ]}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute'
  },
  tooltipContainer: {
    width: RECT_WIDTH,
    height: RECT_HEIGHT,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute'
  },
  tooltipText: {
    color: '#000'
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: TRIANGLE_WIDTH,
    borderLeftColor: 'transparent',
    borderRightWidth: TRIANGLE_WIDTH,
    borderRightColor: 'transparent',
    borderTopWidth: TRIANGLE_HEIGHT,
    borderTopColor: '#000',
    position: 'absolute'
  }
});
