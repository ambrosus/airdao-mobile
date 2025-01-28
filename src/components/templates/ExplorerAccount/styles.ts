import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    paddingLeft: scale(16),
    paddingRight: scale(18)
  },
  actionButton: {
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(12),
    alignSelf: 'flex-start',
    minHeight: verticalScale(24)
  },
  copyText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.neutral400
  },
  copyTextContainer: { padding: 4 }
});
