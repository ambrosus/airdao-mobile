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
  apy: {
    color: COLORS.success300
  }
});
