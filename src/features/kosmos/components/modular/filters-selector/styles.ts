import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(12),
    borderRadius: 100,
    borderWidth: 1,
    borderColor: COLORS.alphaBlack10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 4
  }
});
