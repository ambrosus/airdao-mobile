import { shadow } from '@constants/shadow';
import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(18),
    paddingTop: verticalScale(12)
  },
  input: {
    ...shadow,
    width: '100%',
    backgroundColor: COLORS.neutral0
  },
  newListButton: {
    borderWidth: 1,
    borderColor: 'white',
    width: '100%',
    backgroundColor: COLORS.brand100,
    paddingVertical: verticalScale(12)
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.silver,
    width: '100%'
  }
});
