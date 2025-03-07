import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'space-between'
  },
  buttonWrapper: { paddingHorizontal: scale(16) },
  button: {
    marginBottom: verticalScale(30),
    height: scale(54)
  },
  buttonText: { marginVertical: scale(12) },
  infoContainer: { marginTop: scale(20), paddingHorizontal: scale(16) }
});
