import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  content: {
    paddingHorizontal: scale(18),
    paddingBottom: verticalScale(24)
  },
  actionBtn: {
    marginTop: verticalScale(24),
    paddingVertical: verticalScale(12),
    alignSelf: 'center',
    backgroundColor: COLORS.alphaBlack5,
    width: '100%'
  }
});
