import { StyleSheet } from 'react-native';
import { scale, verticalScale, isAndroid } from '@utils';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  footer: {
    paddingHorizontal: scale(16),
    paddingBottom: isAndroid ? verticalScale(20) : 0
  }
});
