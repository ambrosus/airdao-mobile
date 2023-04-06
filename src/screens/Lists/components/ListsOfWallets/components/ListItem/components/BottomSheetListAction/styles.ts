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
  bottomSheetButton: {
    marginHorizontal: 16,
    borderRadius: 25,
    backgroundColor: COLORS.whiteGrey
  },
  cancelButtonText: {
    paddingVertical: 12,
    alignSelf: 'center'
  }
});
