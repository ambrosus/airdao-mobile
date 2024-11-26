import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(20)
  },
  description: {
    maxWidth: 343
  },
  footer: {
    width: '100%',
    rowGap: verticalScale(16),
    paddingTop: verticalScale(40)
  }
});
