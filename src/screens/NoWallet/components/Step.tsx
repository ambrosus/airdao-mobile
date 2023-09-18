import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  StyleSheet,
  View
} from 'react-native';
import { Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';

export interface StepInfo {
  image: ImageSourcePropType;
  title: string;
  description: string;
}

export const NoWalletStep = (props: { step: StepInfo }) => {
  const { step } = props;
  const { t } = useTranslation();
  return (
    <View style={styles.stepContainer} key={step.title}>
      <Image
        source={step.image}
        blurRadius={0}
        style={{ width: '100%' }}
        resizeMode="cover"
      />
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
    width: Dimensions.get('window').width,
    marginTop: verticalScale(80)
  }
});
