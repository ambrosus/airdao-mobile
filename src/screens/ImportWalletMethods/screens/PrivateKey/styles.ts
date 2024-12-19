import { StyleSheet } from 'react-native';
import { scale, verticalScale, isAndroid } from '@utils';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  titleStyle: {
    fontSize: 18
  },
  description: {
    paddingVertical: scale(20)
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16)
  },
  toggleVisibilityRow: {
    gap: 8
  },
  button: {
    flexDirection: 'row',
    height: verticalScale(54)
  },
  footer: {
    paddingBottom: isAndroid ? verticalScale(20) : 0
  }
});
