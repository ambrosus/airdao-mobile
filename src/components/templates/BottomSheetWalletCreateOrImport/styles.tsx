import { StyleSheet } from 'react-native';
import { scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  buttonWrapper: {
    width: '45%',
    padding: scale(14),
    borderRadius: scale(16),
    alignItems: 'flex-start',
    backgroundColor: COLORS.neutral50
  },
  buttonContainer: { paddingHorizontal: scale(16) }
});
