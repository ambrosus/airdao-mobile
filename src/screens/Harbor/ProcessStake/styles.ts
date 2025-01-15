import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  main: { height: '100%' },
  wrapper: {
    paddingHorizontal: scale(12),
    justifyContent: 'space-between',
    backgroundColor: COLORS.neutral50
  },
  stakeInfoText: {
    paddingHorizontal: scale(2),
    paddingTop: scale(8),
    paddingBottom: scale(16)
  },
  buttonWrapper: { paddingBottom: scale(55) }
});
