import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    fontSize: 24,
    borderBottomWidth: 2,
    borderColor: COLORS.neutral800,
    width: scale(220),
    height: verticalScale(60),
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
    borderColor: COLORS.neutral800,
    marginHorizontal: scale(18)
  },
  circleFilled: {
    backgroundColor: COLORS.neutral800
  }
});
