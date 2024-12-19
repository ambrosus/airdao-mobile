import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  input: {
    fontSize: 24,
    borderBottomWidth: 2,
    borderColor: COLORS.neutral800,
    width: scale(220),
    height: verticalScale(100),
    opacity: 0,
    position: 'absolute',
    zIndex: 10
  },
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
