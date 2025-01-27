import { ReactElement, useCallback } from 'react';
import { runSpring, useValue, Circle, Group } from '@shopify/react-native-skia';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import { COLORS } from '@constants/colors';
import { moderateScale } from '@utils';
import type { SelectionDotProps } from 'react-native-graph';

export function SelectionDot({
  isActive,
  circleX,
  circleY
}: SelectionDotProps): ReactElement {
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
        color={COLORS.success200}
      />
      <Circle
        cx={circleX}
        cy={circleY}
        r={innerCircleRadius}
        color={COLORS.success500}
      />
    </Group>
  );
}
