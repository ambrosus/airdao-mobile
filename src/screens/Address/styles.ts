import { moderateScale } from '@utils/scaling';
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
    backgroundColor: '#2f2b431a'
  },
  headerBtn: {
    backgroundColor: '#2f2b431a',
    height: moderateScale(36),
    width: moderateScale(36)
  },
  headerPersonalListBtn: {
    backgroundColor: COLORS.powderWhite,
    height: moderateScale(36),
    width: moderateScale(36)
  },
  headerWatchListBtn: {
    backgroundColor: COLORS.powderWhite,
    height: moderateScale(36),
    width: moderateScale(36)
  }
});
