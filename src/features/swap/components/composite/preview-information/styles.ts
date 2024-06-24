import { verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: verticalScale(24),
    rowGap: verticalScale(16)
  }
});
