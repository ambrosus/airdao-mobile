import React, { useState } from 'react';
import {
  LayoutChangeEvent,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { Row, Spacer } from '@components/base';
import { BackIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';
import { styles } from './styles';

interface ToolTipProps {
  closedHeight?: number;
  header?: React.JSX.Element;
  icon?: React.JSX.Element;
  content?: React.JSX.Element;
  contentContainerStyle?: ViewStyle;
  headerStyle?: ViewStyle;
  contentWrapperStyle?: ViewStyle;
  onPress?: (payload?: string) => void;
}

export const DropDownPanel = ({
  closedHeight = scale(60),
  header,
  icon = <BackIcon color={COLORS.brand700} />,
  content = <></>,
  contentContainerStyle,
  headerStyle = {},
  contentWrapperStyle = {},
  onPress
}: ToolTipProps) => {
  const [toolTipLayoutHeight, setToolTipLayoutHeight] = useState(closedHeight);

  const initialHeight = useSharedValue(closedHeight);
  const initialRotation = useSharedValue(-90);

  const animatedHeight = useAnimatedStyle(() => {
    return {
      height: withTiming(initialHeight.value)
    };
  });
  const animatedRotation = useAnimatedStyle(() => ({
    transform: [{ rotate: `${initialRotation.value}deg` }]
  }));

  const onOpenPanel = () => {
    const isToolTipClose = initialHeight.value === closedHeight;

    initialHeight.value = withTiming(
      isToolTipClose ? toolTipLayoutHeight : closedHeight,
      {
        duration: 0
      }
    );
    initialRotation.value = withTiming(isToolTipClose ? 90 : -90);
    if (onPress) {
      onPress(isToolTipClose ? 'open' : 'close');
    }
  };

  const onLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setToolTipLayoutHeight(closedHeight + height);
  };

  return (
    <Animated.View style={[styles.main, contentContainerStyle, animatedHeight]}>
      <TouchableOpacity
        style={[styles.header, headerStyle, { height: closedHeight }]}
        onPress={onOpenPanel}
      >
        <Row alignItems="center">{header}</Row>
        <Animated.View style={[styles.icon, animatedRotation]}>
          {icon}
        </Animated.View>
      </TouchableOpacity>

      <View style={contentWrapperStyle} onLayout={onLayout}>
        {content}
        <Spacer value={scale(16)} />
      </View>
    </Animated.View>
  );
};
