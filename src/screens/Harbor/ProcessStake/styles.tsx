import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';

export const styles = StyleSheet.create({
  main: {
    backgroundColor: COLORS.neutral50,
    paddingHorizontal: scale(14),
    height: '100%'
  },
  container: {
    justifyContent: 'space-between',
    height: '95%'
  },
  stakeInfoText: {
    paddingHorizontal: scale(2),
    paddingTop: scale(8),
    paddingBottom: scale(16)
  }
});
