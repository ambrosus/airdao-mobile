import { StyleSheet } from 'react-native';
import { scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.neutral100,
    borderRadius: 16,
    padding: scale(10),
    paddingVertical: scale(12)
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
  regularBtnStyle: {
    color: 'white'
  }
});
