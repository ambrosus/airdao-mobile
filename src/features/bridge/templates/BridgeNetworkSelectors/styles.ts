import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    rowGap: 4
  },
  pickerContainer: {
    paddingHorizontal: scale(5)
  },
  select: {
    width: scale(134),
    height: scale(40),
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.neutral200,
    backgroundColor: COLORS.neutral100,
    borderRadius: scale(134)
  }
});
