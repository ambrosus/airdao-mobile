import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { moderateScale, scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: COLORS.neutral100,
    borderWidth: scale(1),
    borderRadius: moderateScale(16),
    paddingVertical: verticalScale(16),
    paddingHorizontal: verticalScale(16),
    marginBottom: scale(15),
    width: '100%'
  },
  svgContainer: {
    maxHeight: 20,
    maxWidth: 18
  }
});
