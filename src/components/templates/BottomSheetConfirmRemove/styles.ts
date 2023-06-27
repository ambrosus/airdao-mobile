import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  icon: {
    alignSelf: 'center',
    paddingTop: 16
  },
  text: {
    marginTop: verticalScale(24),
    marginHorizontal: scale(24),
    textAlign: 'center'
  },
  removeButton: {
    backgroundColor: COLORS.pinkRed,
    marginHorizontal: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center'
  },
  bottomSheetCancelButton: {
    backgroundColor: COLORS.charcoal,
    borderRadius: 25,
    marginHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center'
  }
});
