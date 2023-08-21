import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { moderateScale, verticalScale } from '@utils/scaling';
import { NoMatch } from '@components/svg/icons/NoMatch';
import { useTranslation } from 'react-i18next';

export function SearchAddressNoResult(): JSX.Element {
  const { t } = useTranslation();
  return (
    <View style={styles.error}>
      <NoMatch />
      <Spacer value={verticalScale(24)} />
      <Text
        color={COLORS.davysGray}
        fontSize={16}
        fontWeight="600"
        fontFamily="Inter_600SemiBold"
      >
        {t('no.matches')}
      </Text>
      <Spacer value={verticalScale(8)} />
      <Text
        fontWeight="400"
        fontSize={16}
        align="center"
        color={COLORS.davysGray}
        fontFamily="Inter_400Regular"
      >
        {t('check.typos')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  error: {
    flex: 1,
    paddingTop: '50%',
    alignItems: 'center',
    paddingHorizontal: '15%'
  },
  circle: {
    width: moderateScale(130),
    height: moderateScale(130),
    borderRadius: moderateScale(65),
    backgroundColor: COLORS.lightSilver
  }
});
