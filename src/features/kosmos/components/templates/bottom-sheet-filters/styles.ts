import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  heading: {
    textAlign: 'center'
  },
  container: {
    paddingHorizontal: scale(24),
    justifyContent: 'space-between'
  },
  filters: {
    rowGap: verticalScale(24),
    marginBottom: verticalScale(32)
  },
  buttonContainer: {
    columnGap: scale(16)
  },
  button: {
    flex: 1,
    height: 45,
    borderRadius: 1000
  },

  buttonText: {
    height: '100%'
  },
  primaryButton: {
    backgroundColor: COLORS.brand600
  }
});
