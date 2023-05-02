import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: 'row'
  },
  optionInfoText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: COLORS.smokyBlack,
    paddingLeft: 12
  },
  optionButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: COLORS.lightGrey,
    paddingRight: 12
  },
  infoTextContainer: { flexDirection: 'row' }
});
