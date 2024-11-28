import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'space-between'
  },
  infoContainer: { marginTop: scale(20), paddingHorizontal: scale(16) },
  buttonWrapper: { paddingHorizontal: scale(16) },
  button: {
    marginBottom: verticalScale(30)
  },
  buttonText: { marginVertical: scale(12) }
});
