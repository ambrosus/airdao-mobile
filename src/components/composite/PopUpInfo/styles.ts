import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  popoverStyle: {
    borderRadius: scale(4),
    padding: scale(8)
  },
  container: {
    backgroundColor: COLORS.neutral200,
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(12),
    height: scale(12),
    borderRadius: scale(8)
  }
});
