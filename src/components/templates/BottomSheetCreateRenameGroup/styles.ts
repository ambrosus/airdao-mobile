import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    paddingHorizontal: scale(18),
    paddingTop: verticalScale(12)
  },
  newListTitle: {
    alignSelf: 'center'
  },
  icon: {
    alignSelf: 'center',
    paddingTop: 16
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
  bottomSheetCreateRenameButton: {
    borderColor: 'white',
    width: '100%',
    borderWidth: 1,
    backgroundColor: COLORS.grey,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center'
  },
  bottomSheetCancelButton: {
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center'
  }
});
