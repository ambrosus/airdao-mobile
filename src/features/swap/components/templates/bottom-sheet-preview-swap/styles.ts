import { COLORS } from '@constants/colors';
import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingTop: verticalScale(16),
    paddingHorizontal: scale(24)
  },
  heading: {
    textAlign: 'center'
  },
  preview: {
    width: '100%',
    flexDirection: 'column',
    backgroundColor: COLORS.neutral50,
    padding: 12,
    borderRadius: moderateScale(16),
    marginTop: verticalScale(16)
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.neutral200,
    alignSelf: 'center'
  }
});
