import { StyleSheet } from 'react-native';
import { scale, moderateScale } from '@utils';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  container: {
    shadowColor: COLORS.culturedWhite,
    backgroundColor: 'white'
  },
  notificationCountContainer: {
    position: 'absolute',
    backgroundColor: COLORS.yellow500,
    right: -3,
    top: -3,
    borderRadius: scale(11),
    borderWidth: 2,
    borderColor: COLORS.neutral0,
    width: moderateScale(11),
    height: moderateScale(11),
    justifyContent: 'center',
    alignItems: 'center'
  },
  addOrImportWalletButton: {
    backgroundColor: COLORS.alphaBlack5,
    width: scale(38),
    height: scale(38)
  }
});
