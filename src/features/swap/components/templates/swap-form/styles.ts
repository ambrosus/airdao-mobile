import { StyleSheet } from 'react-native';
import { isAndroid } from '@utils/isPlatform';
import { scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: {
    flex: 1,
    paddingHorizontal: scale(16),
    justifyContent: 'space-between'
  },
  footer: {
    paddingBottom: isAndroid ? verticalScale(20) : 0
  }
});
