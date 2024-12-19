import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  bottomSheet: {
    backgroundColor: 'rgba(14, 14, 14, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16
  },
  container: {
    width: '100%',
    backgroundColor: COLORS.neutral0,
    borderRadius: scale(24),
    padding: scale(24),
    alignItems: 'center',
    rowGap: verticalScale(16)
  }
});
