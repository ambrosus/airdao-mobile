import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: 300,
    alignItems: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  button: {
    paddingTop: verticalScale(24),
    paddingLeft: scale(16)
  }
});
