import { StyleSheet } from 'react-native';
import { verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: {
    maxHeight: 365,
    marginTop: verticalScale(32)
  }
});
