import { COLORS } from '@constants/colors';
import { shadow } from '@constants/shadow';
import { moderateScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.blue600,
    borderRadius: moderateScale(16),
    ...shadow
  }
});
