import { COLORS } from '@constants/colors';
import { verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: COLORS.neutral100,
    borderRadius: 24,
    marginBottom: 16
  },
  button: {
    marginTop: verticalScale(16),
    paddingVertical: 6
  }
});
