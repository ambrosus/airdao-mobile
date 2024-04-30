import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';
export const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: verticalScale(16),
    paddingHorizontal: scale(24)
  },
  heading: {
    textAlign: 'center'
  },
  tokenRow: {
    gap: 4
  }
});
