import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { moderateScale, scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    paddingTop: verticalScale(16),
    paddingHorizontal: scale(16)
  },
  heading: {
    textAlign: 'center'
  },
  preview: {
    width: '100%',
    flexDirection: 'column',
    backgroundColor: COLORS.neutral50,
    padding: 12,
    borderRadius: moderateScale(16)
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.neutral200,
    alignSelf: 'center'
  }
});
