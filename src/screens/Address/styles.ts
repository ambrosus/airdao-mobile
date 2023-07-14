import { moderateScale, scale } from '@utils/scaling';
import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.separator,
    marginHorizontal: scale(16)
  },
  headerBtn: {
    backgroundColor: COLORS.smokyBlack5,
    height: moderateScale(36),
    width: moderateScale(36)
  },
  headerWatchListBtn: {
    backgroundColor: COLORS.powderWhite,
    height: moderateScale(36),
    width: moderateScale(36)
  }
});
