import { StyleSheet } from 'react-native';
import { shadow } from '@constants/shadow';
import { moderateScale, scale, verticalScale } from '@utils/scaling';

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
  }
});
