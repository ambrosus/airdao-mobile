import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    rowGap: verticalScale(16)
  },
  header: {
    rowGap: verticalScale(8)
  },
  approvalSubheading: {
    paddingHorizontal: 16
  },
  details: {
    borderRadius: 16,
    rowGap: verticalScale(16),
    padding: scale(16),
    backgroundColor: COLORS.neutral50
  },
  secondaryButton: {
    backgroundColor: COLORS.primary50
  }
});
