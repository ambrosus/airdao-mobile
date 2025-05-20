import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxHeight: scale(350),
    backgroundColor: COLORS.neutral0,
    borderRadius: scale(24),
    padding: scale(24),
    alignItems: 'center',
    rowGap: verticalScale(16)
  },
  iconContainer: { transform: [{ rotate: '180deg' }] },
  footerWrapper: {
    rowGap: 16
  },
  approve: {
    width: '45%'
  },
  reject: {
    width: '45%',
    backgroundColor: COLORS.primary50
  }
});
