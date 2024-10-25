import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  status: {
    paddingHorizontal: scale(8),
    borderRadius: 1000,
    minHeight: verticalScale(24)
  },
  statusPoint: {
    height: moderateScale(8),
    width: moderateScale(8),
    borderRadius: moderateScale(4)
  },
  detailsContainer: {
    paddingTop: verticalScale(16),
    rowGap: 16
  },
  innerDetailsContainer: {
    rowGap: 4
  },
  detailsContainerValue: {
    maxWidth: scale(303)
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: verticalScale(16)
  }
});
