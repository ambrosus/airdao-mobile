import React from 'react';
import { StyleProp, ViewStyle, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface ChartStrokedArrowProps {
  styles: StyleProp<ViewStyle>;
}

export const ChartStrokedArrow = ({ styles }: ChartStrokedArrowProps) => {
  return (
    <View style={styles}>
      <Svg width="8" height="16" fill="none" viewBox="0 0 8 16">
        <Path
          fill="#fff"
          stroke="#D5D6D9"
          strokeWidth="0.5"
          d="M7.188 8.165L7.332 8l-.144-.165-7-8-.438-.5v17.33l.438-.5 7-8z"
        ></Path>
      </Svg>
    </View>
  );
};
