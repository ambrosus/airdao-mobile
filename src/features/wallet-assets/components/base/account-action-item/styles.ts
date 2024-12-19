import { COLORS } from '@constants/colors';
import { verticalScale, scale } from '@utils';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(12),
    backgroundColor: COLORS.primary50,
    borderWidth: 0.5,
    borderColor: COLORS.brand600,
    borderRadius: scale(8),
    columnGap: scale(8)
  }
});
