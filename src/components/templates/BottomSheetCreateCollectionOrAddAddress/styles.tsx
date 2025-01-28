import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  main: {
    paddingHorizontal: scale(24),
    paddingBottom: verticalScale(24)
  },
  button: {
    backgroundColor: COLORS.alphaBlack5
  },
  btnTitle: { marginVertical: 12 }
});
