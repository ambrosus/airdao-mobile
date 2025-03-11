import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { moderateScale, scale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    padding: scale(16),
    borderWidth: 0.5,
    borderColor: COLORS.semanticsForegroundBorder,
    borderRadius: moderateScale(16)
  }
});
