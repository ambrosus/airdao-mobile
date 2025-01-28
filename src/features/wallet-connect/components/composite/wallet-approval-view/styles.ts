import { StyleSheet } from 'react-native';
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
    backgroundColor: '#E9EFFB'
  },
  loadingApproveNodeRow: {
    columnGap: scale(8)
  }
});
