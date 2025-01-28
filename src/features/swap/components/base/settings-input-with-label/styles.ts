import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { moderateScale, scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  formWithLabel: {
    rowGap: 8
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: COLORS.neutral0,
    borderRadius: moderateScale(82),
    color: COLORS.black,
    padding: 0,
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    borderWidth: 1,
    borderColor: COLORS.alphaBlack10
  }
});
