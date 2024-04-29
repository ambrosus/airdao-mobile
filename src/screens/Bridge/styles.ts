import { StyleSheet } from 'react-native';
import { scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerHistoryIcon: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(32),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.neutral100
  }
});
