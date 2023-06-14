import React from 'react';
import { StyleProp, TextInput, TextInputProps, TextStyle } from 'react-native';
import Animated, { useAnimatedProps } from 'react-native-reanimated';
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface AnimatedTextProps {
  value: Animated.SharedValue<string>;
  style?: StyleProp<Animated.AnimateStyle<StyleProp<TextStyle>>>;
  animatedProps?: Partial<Animated.AnimateProps<TextInputProps>> | undefined;
}

export function AnimatedText(props: AnimatedTextProps): JSX.Element {
  const { value, style, animatedProps } = props;

  const _animatedProps = useAnimatedProps(() => {
    return {
      text: `$${value.value.toString()}`
    } as any;
  });

  return (
    <AnimatedTextInput
      underlineColorAndroid="transparent"
      editable={false}
      value={value.value}
      {...{ animatedProps: animatedProps || _animatedProps }}
      style={style}
    />
  );
}
