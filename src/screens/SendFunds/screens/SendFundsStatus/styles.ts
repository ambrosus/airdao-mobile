import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: verticalScale(178),
    paddingHorizontal: scale(16)
  },
  button: {
    width: '100%',
    paddingVertical: verticalScale(12)
  }
});
