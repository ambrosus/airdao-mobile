import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  container: {
    marginTop: verticalScale(18),
    paddingHorizontal: scale(8),
    rowGap: 16,
    marginHorizontal: scale(10)
  },
  apy: {
    color: COLORS.success300
  },
  valueText: {
    fontSize: 16,
    color: COLORS.neutral900,
    marginLeft: scale(8)
  }
});
