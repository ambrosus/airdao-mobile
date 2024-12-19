import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils';
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(16)
  },
  description: {
    maxWidth: 327
  },
  footer: {
    width: '100%',
    position: 'absolute',
    bottom: verticalScale(34)
  }
});
