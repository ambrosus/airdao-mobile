import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '@constants/colors';
import { verticalScale } from '@utils/scaling';

interface StepCircleProps {
  currentStep: number;
  step: number;
}

export const StepCircle = (props: StepCircleProps) => {
  const { step, currentStep } = props;
  return (
    <View
      style={[
        styles.stepCircle,
        {
          backgroundColor:
            currentStep === step ? COLORS.yellow500 : COLORS.lightSilver
        }
      ]}
    />
  );
};

const styles = StyleSheet.create({
  stepCircle: {
    alignSelf: 'center',
    height: verticalScale(10),
    width: verticalScale(10),
    borderRadius: verticalScale(5)
  }
});
