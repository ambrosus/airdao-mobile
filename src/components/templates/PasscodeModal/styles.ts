import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  content: {
    backgroundColor: COLORS.white,
    flex: 1,
    paddingTop: 300,
    alignItems: 'center'
  },
  container: {
    backgroundColor: COLORS.white,
    flex: 1
  },
  button: {
    paddingTop: verticalScale(24),
    paddingLeft: scale(16)
  }
});
