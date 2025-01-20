import React from 'react';
import { useTranslation } from 'react-i18next';
import Animated from 'react-native-reanimated';
import { Spacer, Spinner, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { verticalScale } from '@utils';
import { styles } from './styles';

export const StakePending = () => {
  const { t } = useTranslation();
  return (
    <Animated.View style={styles.main}>
      <Spacer value={verticalScale(16)} />
      <Text color={COLORS.neutral800} fontFamily="Inter_700Bold" fontSize={20}>
        {t('staking.pool.pending')}
      </Text>
      <Spacer value={verticalScale(8)} />
      <Text
        color={COLORS.neutral900}
        fontFamily="Inter_500Medium"
        fontSize={14}
      >
        {t('staking.pool.pending.description')}
      </Text>
      <Spacer value={verticalScale(16)} />
      <Spinner />
    </Animated.View>
  );
};
