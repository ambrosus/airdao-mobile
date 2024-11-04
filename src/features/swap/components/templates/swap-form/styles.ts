import { StyleSheet } from 'react-native';
import { isAndroid } from '@utils/isPlatform';
import { scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  footer: {
    paddingHorizontal: scale(16),
    paddingBottom: isAndroid ? verticalScale(20) : 0
  }
});
