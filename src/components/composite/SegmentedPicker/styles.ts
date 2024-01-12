import { Dimensions, StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { shadow } from '@constants/shadow';
import { moderateScale, scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#7676801f',
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(6),
    borderRadius: Dimensions.get('window').width
  },
  segment: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(8)
  },
  selectedSegment: {
    ...shadow,
    backgroundColor: COLORS.neutral0,
    borderRadius: moderateScale(36)
  }
});
