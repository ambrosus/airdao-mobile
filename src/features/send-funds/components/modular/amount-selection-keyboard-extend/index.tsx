import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { Row } from '@components/base';
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle
} from 'react-native-reanimated';
import { PercentageItem } from '../../base';

const PERCENTS = [25, 50, 75, 100];

interface AmountSelectionKeyboardExtendProps {
  isTextInput: boolean;
  onPercentItemPress: (value: number) => void;
}

export const AmountSelectionKeyboardExtend = ({
  isTextInput,
  onPercentItemPress
}: AmountSelectionKeyboardExtendProps) => {
  const keyboard = useAnimatedKeyboard();
  const translateStyle = useAnimatedStyle(() => {
    if (!isTextInput)
      return {
        transform: [{ translateY: 0 }],
        opacity: 0
      };

    return {
      transform: [{ translateY: -keyboard.height.value }],
      opacity: keyboard.height.value > 64 ? 1 : 0,
      springify: { damping: 10 }
    };
  });

  return (
    <Animated.View style={translateStyle}>
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
