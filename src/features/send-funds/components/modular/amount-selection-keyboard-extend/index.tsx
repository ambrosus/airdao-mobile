import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { Row } from '@components/base';
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle
} from 'react-native-reanimated';
import { PercentageItem } from '../../base';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isIos } from '@utils/isPlatform';

const PERCENTS = [25, 50, 75, 100];

interface AmountSelectionKeyboardExtendProps {
  isTextInput: boolean;
  onPercentItemPress: (value: number) => void;
}

export const AmountSelectionKeyboardExtend = ({
  isTextInput,
  onPercentItemPress
}: AmountSelectionKeyboardExtendProps) => {
  const { bottom: bottomInset } = useSafeAreaInsets();
  const keyboard = useAnimatedKeyboard();
  const translateStyle = useAnimatedStyle(() => {
    if (!isTextInput)
      return {
        transform: [{ translateY: 0 }],
        opacity: 0
      };

    const opacity = keyboard.height.value > 64 ? 1 : 0;
    const springify = { damping: 80 };
    const bottom = isIos
      ? keyboard.height.value
      : keyboard.height.value + bottomInset;

    return {
      springify,
      opacity,
      bottom
    };
  });

  return (
    <Animated.View style={[styles.wrapper, translateStyle]}>
      <View style={styles.container}>
        <Row
          alignItems="center"
          justifyContent="center"
          style={styles.innerRow}
        >
          {PERCENTS.map((percent) => (
            <PercentageItem
              symbol
              key={percent}
              percent={percent}
              onPercentItemPress={onPercentItemPress}
            />
          ))}
        </Row>
      </View>
    </Animated.View>
  );
};
