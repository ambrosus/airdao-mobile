import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: { paddingBottom: verticalScale(24) },

  bottomSheetSubtitle: {
    paddingLeft: 24
  },
  bottomSheetInput: {
    marginVertical: 8,
    marginHorizontal: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: COLORS.silver
  },
  buttonWrapper: { paddingHorizontal: scale(24) },
  cancelButton: {
    backgroundColor: COLORS.alphaBlack5,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center'
  }
});
