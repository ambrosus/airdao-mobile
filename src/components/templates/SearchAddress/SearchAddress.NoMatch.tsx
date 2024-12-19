import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Spacer, Text } from '@components/base';
import { NoMatch } from '@components/svg/icons/NoMatch';
import { COLORS } from '@constants/colors';
import { moderateScale, verticalScale } from '@utils';

export function SearchAddressNoResult(): JSX.Element {
  const { t } = useTranslation();
  return (
    <View style={styles.error}>
      <NoMatch />
      <Spacer value={verticalScale(24)} />
      <Text
        color={COLORS.neutral500}
        fontSize={16}
        fontWeight="600"
        fontFamily="Inter_600SemiBold"
      >
        {t('explore.search.no.matches')}
      </Text>
      <Spacer value={verticalScale(8)} />
      <Text
        fontWeight="400"
        fontSize={16}
        align="center"
        color={COLORS.neutral500}
        fontFamily="Inter_400Regular"
      >
        {t('explore.search.check.typos')}
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
