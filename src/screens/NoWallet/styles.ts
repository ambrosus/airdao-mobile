import { Platform, StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: verticalScale(Platform.select({ ios: 0, default: 4 }))
  },
  buttons: {
    flex: 1,
    paddingHorizontal: scale(16)
  }
});
