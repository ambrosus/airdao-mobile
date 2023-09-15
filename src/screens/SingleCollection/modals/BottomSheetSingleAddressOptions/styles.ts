import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  icon: {
    alignSelf: 'center',
    paddingTop: 16
  },
  text: {
    paddingHorizontal: 43,
    textAlign: 'center'
  },
  moveButton: {
    backgroundColor: COLORS.alphaBlack5,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center'
  },
  renameButton: {
    backgroundColor: COLORS.alphaBlack5,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center'
  },
  removeButton: {
    backgroundColor: COLORS.error100,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center'
  }
});
