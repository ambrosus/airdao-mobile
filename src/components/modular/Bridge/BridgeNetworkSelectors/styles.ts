import { StyleSheet } from 'react-native';
import { scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    rowGap: 4
  },
  select: {
    width: scale(134),
    height: 32,
    paddingHorizontal: scale(11),
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.separator,
    borderRadius: scale(134)
  },
  selectInnerRowGap: {
    columnGap: 4
  },
  reorder: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.neutral100
  }
});
