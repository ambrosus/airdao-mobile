import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    paddingHorizontal: scale(18),
    paddingTop: verticalScale(12)
  },
  newListTitle: {
    alignSelf: 'flex-start'
  },
  bottomSheetInput: {
    marginVertical: 8,
    paddingVertical: 12,
    width: '100%',
    paddingHorizontal: 16,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: COLORS.silver
  },
  bottomSheetCancelButton: {
    borderColor: 'transparent',
    width: '100%',
    borderWidth: 1,
    backgroundColor: COLORS.neutral900Alpha[5],
    paddingVertical: verticalScale(12),
    borderRadius: 25,
    alignItems: 'center'
  }
});
