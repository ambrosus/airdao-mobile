import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  main: {
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(12),
    borderRadius: 1000,
    backgroundColor: COLORS.brand600,
    width: scale(120)
  },
  container: { minHeight: verticalScale(260), maxHeight: '75%' },
  wrapper: { paddingBottom: verticalScale(24) }
});
