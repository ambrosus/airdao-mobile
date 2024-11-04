import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(16),
    borderRadius: scale(16)
  }
});
