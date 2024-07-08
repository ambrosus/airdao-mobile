import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';
import { isAndroid } from '@utils/isPlatform';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  titleStyle: {
    fontSize: 18
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
  footer: {
    paddingBottom: isAndroid ? verticalScale(20) : 0
  }
});
