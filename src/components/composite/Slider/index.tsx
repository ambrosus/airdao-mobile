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
import { COLORS } from '@constants/colors';
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
    onEndDrag = () => null,
    onEndDrag2 = () => null,
    isSecondPointVisible = false
  } = props;
  const knobX = useSharedValue(115);
  const knobX2 = useSharedValue(240);
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

  const knobStyle2 = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: knobX2.value - knobSize / 2 },
        { translateY: -knobSize / 2 + 1 }
      ],
      position: 'absolute'
    };
  });

  const currentValue = useDerivedValue(() =>
    Math.floor(knobX.value * stepValue)
  );

  const currentValue2 = useDerivedValue(() =>
    Math.floor(knobX2.value * stepValue)
  );

  const animatedProps = useAnimatedProps(() => {
    return {
      text: currentValue.value.toString()
    } as any;
  });

  const animatedProps2 = useAnimatedProps(() => {
    return {
      text: currentValue2.value.toString()
    } as any;
  });

  const filledStyle = useAnimatedStyle(
    () =>
      isSecondPointVisible
        ? {
            left: knobX.value,
            width: knobX2.value - knobX.value,
            height: 4,
            position: 'absolute',
            backgroundColor: fillColor
          }
        : { width: knobX.value, backgroundColor: fillColor, height: 4 },
    [knobX.value, knobX2.value]
  );

  const animatedMinValueStyle = useAnimatedStyle(() => ({
    paddingTop: 6,
    marginLeft: -32,
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.lightGrey,
    opacity: currentValue.value === minValue ? 0 : 1
  }));

  const animatedMaxValueStyle = useAnimatedStyle(() => ({
    paddingTop: 6,
    marginRight: -32,
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.lightGrey,
    opacity: currentValue.value === maxValue ? 0 : 1
  }));

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      (ctx as { offsetX: number }).offsetX = knobX.value;
    },
    onActive: (event, ctx) => {
      if (knobX.value + knobSize + 10 >= knobX2.value) return;
      let nextX = (ctx as { offsetX: number }).offsetX + event.translationX;
      if (nextX < 0) nextX = 0;
      else if (nextX > width) nextX = width;

      knobX.value = nextX;
    },
    onEnd: () => {
      runOnJS(onEndDrag)(currentValue.value);
    }
  });

  const onGestureEvent2 = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      (ctx as { offsetX: number }).offsetX = knobX.value;
    },
    onActive: (event, ctx) => {
      if (knobX2.value <= knobX.value + knobSize) return;
      let nextX = (ctx as { offsetX: number }).offsetX + event.translationX;
      if (nextX < 0) nextX = 0;
      else if (nextX > width) nextX = width;

      knobX2.value = nextX;
    },
    onEnd: () => {
      runOnJS(onEndDrag2)(currentValue2.value);
    }
  });

  return (
    <View style={[style, { width }]}>
      <View style={[styles.line, { backgroundColor: emptyColor }]}>
        <Animated.View style={filledStyle}></Animated.View>
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
      {isSecondPointVisible && (
        <>
          <View style={styles.minMax}>
            <Animated.Text style={animatedMinValueStyle}>MIN</Animated.Text>
            <Animated.Text style={animatedMaxValueStyle}>MAX</Animated.Text>
          </View>
          <PanGestureHandler {...{ onGestureEvent: onGestureEvent2 }}>
            <Animated.View style={knobStyle2}>
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
                value={currentValue2.value.toString()}
                style={styles.currentValue}
                {...{ animatedProps: animatedProps2 }}
              />
            </Animated.View>
          </PanGestureHandler>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  line: {
    width: '100%',
    height: 4
  },
  knob: {
    shadowColor: COLORS.black,
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
    color: COLORS.black,
    alignSelf: 'center',
    marginTop: 11
  }
});
