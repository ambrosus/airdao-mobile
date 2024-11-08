import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  innerContainer: {
    width: '100%',
    paddingHorizontal: scale(24),
    rowGap: verticalScale(24)
  },
  formWithLabel: {
    rowGap: 8
  },
  switches: {
    gap: verticalScale(16)
  }
});