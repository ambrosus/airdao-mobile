import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { COLORS } from '@constants/colors';
import { Text } from '@components/base';

export const MultiRangeSlider = () => {
  const [values, setValues] = useState([30, 70]);
  const onValuesChange = (values) => {
    setValues(values);
  };
  return (
    <View style={styles.slider}>
      <MultiSlider
        values={values}
        min={0}
        max={100}
        step={10}
        snapped={true}
        sliderLength={320}
        isMarkersSeparated={true}
        onValuesChange={onValuesChange}
        selectedStyle={{ backgroundColor: COLORS.grey }}
        trackStyle={{ backgroundColor: COLORS.silver }}
        markerStyle={{ backgroundColor: COLORS.white }}
        containerStyle={{ height: 40 }}
        customMarkerLeft={(e) => {
          return (
            <View style={styles.container}>
              <View style={styles.circleShadow} />
              <Text style={styles.sliderText}>{e.currentValue}</Text>
            </View>
          );
        }}
        customMarkerRight={(e) => {
          return (
            <View style={styles.container}>
              <View style={styles.circleShadow} />
              <Text style={styles.sliderText}>{e.currentValue}</Text>
            </View>
          );
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  slider: {
    paddingHorizontal: 32,
    paddingTop: 16,
    paddingBottom: 32
  },
  sliderText: {
    color: COLORS.black,
    position: 'absolute',
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    top: 40
  },
  container: {
    position: 'relative',
    alignItems: 'center'
  },
  circleShadow: {
    width: 30,
    height: 30,
    borderRadius: 50,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3
  }
});
