import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  linkBtn: {
    backgroundColor: COLORS.primary50,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    gap: 10
  },
  socialButtons: {
    flex: 1,
    flexWrap: 'wrap',
    rowGap: scale(16),
    columnGap: verticalScale(16)
  },
  websiteArrowRotateIcon: {
    transform: [
      {
        rotate: '-45deg'
      }
    ]
  }
});
