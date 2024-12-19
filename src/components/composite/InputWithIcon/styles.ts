import { Platform, StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { moderateScale, scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(16),
    backgroundColor: COLORS.neutral0,
    borderRadius: moderateScale(82),
    borderWidth: 1,
    borderColor: COLORS.alphaBlack10
  },
  focusedStyle: {
    borderColor: COLORS.brand300
  },
  input: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: 'transparent',
    borderRadius: moderateScale(82),
    shadowColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical:
      Platform.OS === 'android' ? verticalScale(8) : verticalScale(13.5)
  },
  iconWrapper: { position: 'absolute' }
});
