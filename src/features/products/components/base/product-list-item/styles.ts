import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: verticalScale(96),
    borderRadius: 16,
    justifyContent: 'center',
    paddingHorizontal: scale(16)
  },
  innerContainer: {
    rowGap: 4
  }
});
