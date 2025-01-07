import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(16)
  }
});
