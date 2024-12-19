import { StyleSheet } from 'react-native';
import { verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: verticalScale(24),
    rowGap: verticalScale(16)
  }
});
