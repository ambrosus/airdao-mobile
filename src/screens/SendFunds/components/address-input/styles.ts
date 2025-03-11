import { StyleSheet } from 'react-native';
import { verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    rowGap: verticalScale(8)
  },
  input: { fontSize: 16, letterSpacing: -0.16 },
  touchableHandlerArea: {
    width: '100%',
    height: 60,
    position: 'absolute',
    top: 15,
    zIndex: 100
  }
});
