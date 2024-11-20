import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  main: {
    flex: 1
  },
  headerShadow: { shadowColor: 'transparent' },
  container: {
    flexGrow: 1,
    justifyContent: 'space-between'
  },
  descriptionWrapper: {
    paddingHorizontal: scale(16)
  },
  description: { paddingVertical: scale(20) },
  error: { paddingHorizontal: scale(20) },
  button: {
    flexDirection: 'row',
    bottom: verticalScale(32),
    height: verticalScale(54),
    marginHorizontal: scale(16)
  },
  buttonText: { marginVertical: scale(12) }
});
