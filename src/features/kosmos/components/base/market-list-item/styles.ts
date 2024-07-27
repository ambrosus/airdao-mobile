import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(16)
  }
});
