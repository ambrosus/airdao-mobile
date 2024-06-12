import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale, moderateScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  previewTokensDivider: {
    width: scale(32),
    height: scale(32),
    borderRadius: moderateScale(32),
    backgroundColor: COLORS.alphaBlack5,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
