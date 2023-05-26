import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  newListTitle: {
    alignSelf: 'center'
  },
  icon: {
    alignSelf: 'center',
    paddingTop: 16
  },
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
  saveButton: {
    backgroundColor: COLORS.deepBlue,
    marginHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center'
  },
  cancelButton: {
    backgroundColor: COLORS.charcoal,
    marginHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center'
  },
  bottomSheetCreateRenameButton: {
    backgroundColor: COLORS.grey,
    marginHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center'
  },
  bottomSheetCancelButton: {
    marginHorizontal: 18,
    paddingVertical: 16,
    alignItems: 'center'
  }
});
