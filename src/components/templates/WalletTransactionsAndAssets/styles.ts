import { StyleSheet } from 'react-native';
import { verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  loader: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: verticalScale(32)
  }
});
