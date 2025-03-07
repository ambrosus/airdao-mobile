import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.alphaBlack5,
    paddingLeft: scale(12),
    paddingRight: scale(8),
    paddingVertical: verticalScale(2),
    borderRadius: 1000,
    alignSelf: 'center'
  }
});
