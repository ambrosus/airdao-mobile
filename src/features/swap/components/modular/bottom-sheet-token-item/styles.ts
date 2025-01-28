import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(16),
    borderRadius: scale(16)
  }
});
