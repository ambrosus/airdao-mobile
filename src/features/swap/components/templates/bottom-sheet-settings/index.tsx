import React, { forwardRef } from 'react';
import { Keyboard, Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { Spacer, Text } from '@components/base';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { useForwardedRef } from '@hooks';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';
import {
  SettingsDeadlineForm,
  SettingsExpertModeForm,
  SettingsSlippageToleranceForm,
  SettingsMultiHopForm
} from '@/features/swap/components/composite';

export const BottomSheetSwapSettings = forwardRef<BottomSheetRef, unknown>(
  (_, ref) => {
    const { t } = useTranslation();
    const bottomSheetSwapSettingsRef = useForwardedRef(ref);
    return (
      <BottomSheet swiperIconVisible ref={bottomSheetSwapSettingsRef}>
        <Pressable onPress={Keyboard.dismiss}>
          <Spacer value={scale(16)} />
          <Text
            fontSize={20}
            fontFamily="Inter_600SemiBold"
            color={COLORS.neutral800}
            style={styles.heading}
          >
            {t('swap.settings.heading')}
          </Text>

          <View style={styles.container}>
            <Spacer value={scale(16)} />
            <SettingsSlippageToleranceForm />
            <SettingsDeadlineForm />
            <View style={styles.switches}>
              <SettingsExpertModeForm />
              <SettingsMultiHopForm />
            </View>
          </View>
          <Spacer value={scale(56)} />
        </Pressable>
      </BottomSheet>
    );
  }
);
