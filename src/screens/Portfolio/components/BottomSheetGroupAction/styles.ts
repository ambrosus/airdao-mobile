import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  icon: {
    alignSelf: 'center',
    paddingTop: 16
  },
  text: {
    paddingHorizontal: 40,
    textAlign: 'center'
  },
  bottomSheetRenameButton: {
    marginHorizontal: 16,
    borderRadius: 25,
    backgroundColor: COLORS.brand500
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
