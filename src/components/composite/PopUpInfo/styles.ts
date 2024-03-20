import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';
import { StyleSheet } from 'react-native';
import { isAndroid } from '@utils/isPlatform';

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
