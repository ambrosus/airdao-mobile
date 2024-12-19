import { moderateScale, scale } from '@utils';
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
    backgroundColor: COLORS.alphaBlack5,
    height: moderateScale(36),
    width: moderateScale(36)
  },
  headerWatchListBtn: {
    backgroundColor: COLORS.brand100,
    height: moderateScale(36),
    width: moderateScale(36)
  }
});
