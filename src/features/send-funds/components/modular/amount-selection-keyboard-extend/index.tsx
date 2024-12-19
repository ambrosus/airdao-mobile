import React from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Row } from '@components/base';
import { isIos } from '@utils';
import { styles } from './styles';
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
  const { bottom: bottomInset } = useSafeAreaInsets();
  const keyboard = useAnimatedKeyboard();

  const translateStyle = useAnimatedStyle(() => {
    if (!isTextInput)
      return {
        transform: [{ translateY: -bottomInset }],
        opacity: 0
      };

    const {
      height: { value }
    } = keyboard;

    const opacity = value > 64 ? 1 : 0;
    const springify = { damping: 80 };
    const bottom = isIos ? value - bottomInset : value;

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
