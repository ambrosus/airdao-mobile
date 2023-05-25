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
