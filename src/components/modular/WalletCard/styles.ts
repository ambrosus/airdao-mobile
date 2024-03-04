import { COLORS } from '@constants/colors';
import { shadow } from '@constants/shadow';
import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';
import { WalletCardHeight } from '@components/modular';

export const styles = StyleSheet.create({
  container: {
    borderRadius: moderateScale(16),
    width: scale(300),
    height: verticalScale(172),
    minHeight: WalletCardHeight,
    overflow: 'hidden',
    paddingLeft: scale(20),
    paddingVertical: verticalScale(24),
    justifyContent: 'space-between',
    ...shadow
  },
  logo: {
    position: 'absolute',
    top: -verticalScale(16),
    right: -scale(16)
  },
  usdPriceBg: {
    justifyContent: 'center',
    minHeight: verticalScale(20),
    borderRadius: 1000,
    backgroundColor: COLORS.alphaWhite5,
    paddingHorizontal: scale(8)
  }
});
