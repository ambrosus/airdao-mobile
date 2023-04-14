import React from 'react';
import { View } from 'react-native';
import Popover from 'react-native-popover-view';
import { Spacer, Text } from '@components/base';
import { styles } from './styles';
import { useOnboardingPopUp } from '@hooks/useOnBoardingPopUp';
import { OnBoardingStatus } from '@components/composite/PopUpOnBoarding/PopUpOnBoarding.types';

export const PopUpOnBoarding = ({ step }: { step: OnBoardingStatus }) => {
  const { title, subtitle } = useOnboardingPopUp(step);

  if (!title) {
    return null;
  }

  return (
    <Popover isVisible={true} popoverStyle={styles.popover}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <Spacer />
      </View>
    </Popover>
  );
};
