import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(16),
    rowGap: verticalScale(16)
  },
  buttonWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8
  }
});
