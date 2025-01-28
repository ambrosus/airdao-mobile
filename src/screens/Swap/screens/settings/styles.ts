import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  innerContainer: {
    width: '100%',
    paddingHorizontal: scale(24),
    rowGap: verticalScale(24)
  },
  switches: {
    gap: verticalScale(16)
  }
});
