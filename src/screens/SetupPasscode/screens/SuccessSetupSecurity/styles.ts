import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(27)
  },
  button: {
    paddingHorizontal: scale(16),
    position: 'relative',
    flexDirection: 'row',
    height: verticalScale(54),
    width: '90%',
    alignSelf: 'center',
    paddingVertical: verticalScale(12),
    backgroundColor: COLORS.brand600
  }
});
