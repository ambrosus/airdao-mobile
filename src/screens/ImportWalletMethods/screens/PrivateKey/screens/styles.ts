import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: scale(16)
  },
  inner: {
    flex: 1,
    justifyContent: 'center'
  },
  upperContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    rowGap: verticalScale(8)
  },
  error: {
    textAlign: 'center'
  },
  button: {
    width: '100%'
  }
});
