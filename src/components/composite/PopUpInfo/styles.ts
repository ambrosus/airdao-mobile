import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale, isAndroid } from '@utils';

export const styles = StyleSheet.create({
  popoverStyle: {
    borderRadius: scale(4),
    padding: scale(8)
  },
  infoIcon: {
    bottom: scale(isAndroid ? 2 : 1),
    height: scale(10)
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
