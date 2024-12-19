import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { shadow } from '@constants/shadow';
import { moderateScale, scale, verticalScale } from '@utils';

export const WalletCardHeight = 139;

export const styles = StyleSheet.create({
  container: {
    borderRadius: moderateScale(16),
    width: scale(321),
    height: verticalScale(139),
    minHeight: WalletCardHeight,
    overflow: 'hidden',
    paddingLeft: scale(20),
    paddingVertical: verticalScale(14),
    justifyContent: 'space-between',
    ...shadow
  },
  logo: {
    position: 'absolute',
    top: 0,
    right: 0
  },
  copiedTextWrapperStyle: {
    backgroundColor: COLORS.lightWhite,
    borderColor: COLORS.transparentWhite,
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 20
  },
  footerTypography: {
    lineHeight: moderateScale(20)
  }
});
