import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  main: {
    height: '100%',
    justifyContent: 'space-between'
  },
  header: { shadowColor: 'transparent' },
  passcodeWrapper: { paddingHorizontal: scale(15) },
  button: {
    marginBottom: verticalScale(30),
    height: scale(54)
  }
});
