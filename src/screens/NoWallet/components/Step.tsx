import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { DEVICE_WIDTH } from '@constants/variables';

export interface StepInfo {
  image: ReactNode;
  title: string;
  description: string;
}

export const NoWalletStep = (props: { step: StepInfo }) => {
  const { step } = props;
  const { t } = useTranslation();
  return (
    <View style={styles.stepContainer} key={step.title}>
      {step.image}
      <Spacer value={verticalScale(42)} />
      <View style={{ paddingHorizontal: scale(20) }}>
        <Text
          fontSize={20}
          fontFamily="Inter_700Bold"
          color={COLORS.neutral900}
          align="center"
        >
          {t(step.title)}
        </Text>
        <Spacer value={verticalScale(8)} />
        <Text
          fontSize={16}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral900}
          align="center"
        >
          {t(step.description)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    alignItems: 'center',
    width: DEVICE_WIDTH,
    marginTop: verticalScale(80)
  }
});
