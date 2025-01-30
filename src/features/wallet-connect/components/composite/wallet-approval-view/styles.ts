import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    rowGap: verticalScale(8)
  },
  description: {
    textAlign: 'center'
  },
  footer: {
    rowGap: 16
  },
  secondaryButton: {
    backgroundColor: COLORS.primary50
  },
  loadingApproveNodeRow: {
    columnGap: scale(8)
  }
});
