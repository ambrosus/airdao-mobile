import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  icon: {
    alignSelf: 'center',
    paddingTop: 16
  },
  text: {
    alignSelf: 'center'
  },
  bottomSheetRenameButton: {
    marginHorizontal: 16,
    borderRadius: 25,
    backgroundColor: COLORS.grey
  },
  bottomSheetDeleteButton: {
    marginHorizontal: 16,
    borderRadius: 25
  },
  cancelButtonText: {
    paddingVertical: 12,
    alignSelf: 'center'
  }
});
