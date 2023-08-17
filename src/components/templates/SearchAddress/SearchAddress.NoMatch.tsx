import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { moderateScale, verticalScale } from '@utils/scaling';
import { NoMatch } from '@components/svg/icons/NoMatch';

export function SearchAddressNoResult(): JSX.Element {
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
        Oops! No matches found
      </Text>
      <Spacer value={verticalScale(8)} />
      <Text
        fontWeight="400"
        fontSize={16}
        align="center"
        color={COLORS.davysGray}
        fontFamily="Inter_400Regular"
      >
        Please check for any typos or try a different address
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
