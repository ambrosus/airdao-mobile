import { COLORS } from '@constants/colors';
import { moderateScale, scale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    padding: scale(12),
    borderWidth: 0.5,
    borderColor: COLORS.semanticsForegroundBorder,
    borderRadius: moderateScale(16)
  }
});
