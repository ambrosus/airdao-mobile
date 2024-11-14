import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: COLORS.neutral100,
    borderRadius: 24,
    marginBottom: 16,
    marginHorizontal: scale(16)
  },
  button: {
    height: 32,
    marginTop: verticalScale(16),
    paddingVertical: 8
  }
});
