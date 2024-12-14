import { scale } from '@utils/scaling';
import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
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
  },
  loadingBtnStyle: {
    color: COLORS.neutral0
  },
  tryAgainBtn: {
    color: COLORS.neutral0
  },
  closeBtn: {
    color: COLORS.neutral600
  }
});
