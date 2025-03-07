import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  circlesContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  circle: {
    width: 18,
    height: 18,
    borderRadius: 25,
    borderWidth: 2,
    backgroundColor: COLORS.neutral100,
    borderColor: COLORS.neutral300,
    marginHorizontal: scale(18)
  },
  circleFilled: {
    borderWidth: 0,
    width: 18,
    height: 18,
    backgroundColor: COLORS.brand500
  }
});
