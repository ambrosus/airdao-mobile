import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  runOnJS
} from 'react-native-reanimated';
import { SliderProps } from './Slider.types';
import {
  SliderEmptyColor,
  SliderFillColor,
  SliderKnobColor,
  SliderKnobSize
} from './Slider.constants';
Animated.addWhitelistedNativeProps({ text: true });

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export function Slider(props: SliderProps): JSX.Element {
  const {
    minValue,
    maxValue,
    width,
    style,
    knobSize = SliderKnobSize,
    fillColor = SliderFillColor,
    emptyColor = SliderEmptyColor,
    knobColor = SliderKnobColor,
    onEndDrag = () => null
  } = props;
  const knobX = useSharedValue(0);
  const stepValue = (maxValue - minValue) / width;

  const knobStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: knobX.value - knobSize / 2 },
        { translateY: -knobSize / 2 + 1 }
      ],
      position: 'absolute'
    };
  });

  const currentValue = useDerivedValue(() =>
    Math.floor(knobX.value * stepValue)
  );

  const animatedProps = useAnimatedProps(() => {
    return {
      text: currentValue.value.toString()
    } as any;
  });

  const filledStyle = useAnimatedStyle(
    () => ({ width: knobX.value, backgroundColor: fillColor, height: 2 }),
    [knobX.value]
  );

  const animatedMinValueStyle = useAnimatedStyle(() => ({
    opacity: currentValue.value === minValue ? 0 : 1
  }));

  const animatedMaxValueStyle = useAnimatedStyle(() => ({
    opacity: currentValue.value === maxValue ? 0 : 1
  }));

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.offsetX = knobX.value;
    },
    onActive: (event, ctx) => {
      let nextX = ctx.offsetX + event.translationX;
      if (nextX < 0) nextX = 0;
      else if (nextX > width) nextX = width;

      knobX.value = nextX;
    },
    onEnd: () => {
      runOnJS(onEndDrag)(currentValue.value);
    }
  });

  return (
    <View style={[style, { width }]}>
      <View style={[styles.line, { backgroundColor: emptyColor }]}>
        <Animated.View style={filledStyle}></Animated.View>
      </View>
      <View style={styles.minMax}>
        <Animated.Text style={animatedMinValueStyle}>{minValue}</Animated.Text>
        <Animated.Text style={animatedMaxValueStyle}>{maxValue}</Animated.Text>
      </View>
      <PanGestureHandler {...{ onGestureEvent }}>
        <Animated.View style={knobStyle}>
          <Animated.View
            style={[
              styles.knob,
              {
                backgroundColor: knobColor,
                width: knobSize,
                height: knobSize,
                borderRadius: knobSize / 2
              }
            ]}
          />
          <AnimatedTextInput
            underlineColorAndroid="transparent"
            editable={false}
            value={currentValue.value.toString()}
            style={styles.currentValue}
            {...{ animatedProps }}
          />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  line: {
    width: '100%',
    height: 4
  },
  knob: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    elevation: 4
  },
  minMax: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  currentValue: {
    color: '#000000',
    alignSelf: 'center',
    marginTop: 2
  }
});
