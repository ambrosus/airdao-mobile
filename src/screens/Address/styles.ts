import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { DEVICE_HEIGHT } from '@constants/variables';
import { moderateScale, scale } from '@utils';

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

  stub: {
    width: '100%',
    height: DEVICE_HEIGHT * 0.5,
    backgroundColor: COLORS.neutral0,
    position: 'absolute',
    bottom: 0
  }
});
