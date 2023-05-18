import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 132
  },
  createButton: {
    paddingLeft: scale(18),
    paddingRight: scale(16),
    paddingVertical: verticalScale(8),
    marginTop: verticalScale(16),
    borderRadius: 25,
    backgroundColor: COLORS.deepBlue
  },
  text: {
    marginLeft: scale(10)
  }
});
