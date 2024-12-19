import { scale, verticalScale } from '@utils';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(16)
  }
});
