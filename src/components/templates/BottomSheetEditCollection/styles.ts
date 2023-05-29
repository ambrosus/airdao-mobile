import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  content: {
    paddingHorizontal: scale(18),
    paddingBottom: verticalScale(24)
  },
  actionBtn: {
    marginTop: verticalScale(24),
    paddingVertical: verticalScale(12),
    alignSelf: 'center',
    backgroundColor: COLORS.smokyBlack5,
    width: '100%'
  }
});
