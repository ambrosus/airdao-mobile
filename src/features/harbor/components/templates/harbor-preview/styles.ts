import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  container: {
    marginTop: verticalScale(18),
    paddingHorizontal: scale(16),
    rowGap: 16,
    marginHorizontal: scale(12)
  },
  wrapper: {
    backgroundColor: COLORS.neutral100,
    borderRadius: 16,
    padding: scale(8)
  },
  title: {
    fontSize: 16,
    color: COLORS.neutral600
  },
  valueText: {
    fontSize: 16,
    color: COLORS.neutral900,
    marginLeft: scale(8)
  },
  apy: {
    color: COLORS.success300
  }
});
