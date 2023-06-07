import React, { useCallback } from 'react';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import { runSpring, useValue, Circle, Group } from '@shopify/react-native-skia';
import type { SelectionDotProps } from 'react-native-graph';
import { moderateScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

export function SelectionDot({
  isActive,
  circleX,
  circleY
}: SelectionDotProps): React.ReactElement {
  const outerCircleRadius = useValue(0);
  const innerCircleRadius = useValue(0);

  const setIsActive = useCallback(
    (active: boolean) => {
      // outer circle
      runSpring(outerCircleRadius, active ? moderateScale(11.5) : 0, {
        mass: 1,
        stiffness: 1000,
        damping: 50,
        velocity: 0
      });
      // inner circle
      runSpring(innerCircleRadius, active ? moderateScale(5.5) : 0, {
        mass: 1,
        stiffness: 1000,
        damping: 50,
        velocity: 0
      });
    },
    [innerCircleRadius, outerCircleRadius]
  );

  useAnimatedReaction(
    () => isActive.value,
    (active) => {
      runOnJS(setIsActive)(active);
    },
    [isActive, setIsActive]
  );
  return (
    <Group blendMode="multiply">
      <Circle
        cx={circleX}
        cy={circleY}
        r={outerCircleRadius}
        color={COLORS.chartSelectionLightGreen}
      />
      <Circle
        cx={circleX}
        cy={circleY}
        r={innerCircleRadius}
        color={COLORS.chartSelectionDarkGreen}
      />
    </Group>
  );
}
