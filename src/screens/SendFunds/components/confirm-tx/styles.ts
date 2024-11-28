import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: scale(16)
  },
  innerContainer: {
    width: '100%',
    rowGap: verticalScale(24)
  },
  amountContainerRow: {
    columnGap: 4
  },
  pendingLayout: {
    columnGap: scale(8)
  },
  errorFooter: {
    width: '100%',
    justifyContent: 'center',
    marginTop: verticalScale(16),
    rowGap: verticalScale(16)
  },
  secondaryButton: {
    width: '100%',
    backgroundColor: COLORS.primary50
  },
  description: {
    maxWidth: 343
  }
});
