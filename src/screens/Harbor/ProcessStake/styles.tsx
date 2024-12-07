import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';

export const styles = StyleSheet.create({
  main: {
    backgroundColor: COLORS.neutral100,
    paddingHorizontal: scale(14),
    height: '100%'
  },
  stakeInfoText: {
    paddingHorizontal: scale(2),
    paddingTop: scale(8),
    paddingBottom: scale(16)
  }
});
